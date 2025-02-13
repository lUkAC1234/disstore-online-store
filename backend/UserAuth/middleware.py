import logging
from datetime import timedelta
from django.utils import timezone
from django.db import transaction
from .models import VisitHistory

logger = logging.getLogger(__name__)

# ACTIVITY_TIMEOUT: if no ping is received within 3 hours, we consider the previous session expired.
ACTIVITY_TIMEOUT = timedelta(hours=3)
# MIN_UPDATE_INTERVAL: update the record at most once every 30 seconds.
MIN_UPDATE_INTERVAL = timedelta(seconds=30)

class TrackUserActivityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Only process tracking on our designated ping endpoint.
        if request.path == '/api/auth/ping/':
            self.update_visit(request)
        response = self.get_response(request)
        return response

    def update_visit(self, request):
        """
        Ensure a VisitHistory record exists for the current session and update it.
        – Use the session key to uniquely identify the visit.
        – Only update if at least MIN_UPDATE_INTERVAL has passed since last update.
        – If the existing record has expired (end_time <= now), create a new one.
        """
        session_key = self._ensure_session(request)
        ip_address = self.get_client_ip(request)
        now = timezone.now().replace(microsecond=0)

        # Determine the current user (if any)
        user = request.user if request.user.is_authenticated else None

        with transaction.atomic():
            # Look for the most recent VisitHistory record for this session.
            last_visit = VisitHistory.objects.filter(session_key=session_key).order_by('-start_time').first()

            if last_visit:
                # Only update if at least MIN_UPDATE_INTERVAL has passed
                if now - last_visit.last_seen >= MIN_UPDATE_INTERVAL:
                    if last_visit.end_time > now:
                        # Update the existing record.
                        last_visit.last_seen = now
                        # Extend end_time to now + ACTIVITY_TIMEOUT.
                        last_visit.end_time = now + ACTIVITY_TIMEOUT
                        # If the user just authenticated and the record had no user, update it.
                        if user and not last_visit.user:
                            last_visit.user = user
                        last_visit.save(update_fields=['last_seen', 'end_time', 'user'])
                        logger.info(f"Updated visit record (session {session_key}).")
                    else:
                        # The previous record expired; create a new record.
                        self._create_visit(user, session_key, ip_address, now)
                        logger.info(f"Previous record expired; created new visit record (session {session_key}).")
                else:
                    # Not enough time has passed – do nothing.
                    logger.debug(f"Skipping update: only {now - last_visit.last_seen} elapsed since last update.")
            else:
                # No record exists yet: create a new one.
                self._create_visit(user, session_key, ip_address, now)
                logger.info(f"Created new visit record (session {session_key}).")

    def _create_visit(self, user, session_key, ip_address, now):
        VisitHistory.objects.create(
            user=user,
            session_key=session_key,
            ip_address=ip_address,
            start_time=now,
            last_seen=now,
            end_time=now + ACTIVITY_TIMEOUT
        )

    def _ensure_session(self, request):
        """
        Ensure a valid session exists.
        If no session exists, create one and save it so that the cookie is sent.
        """
        if not request.session.session_key:
            request.session.create()
            request.session.modified = True
            request.session.save()
            # Optionally, set session expiry if desired.
            request.session.set_expiry(ACTIVITY_TIMEOUT.total_seconds())
        return request.session.session_key

    def get_client_ip(self, request):
        """
        Extract the client IP address, checking the X-Forwarded-For header if available.
        """
        xff = request.META.get('HTTP_X_FORWARDED_FOR', '')
        return xff.split(',')[0].strip() if xff else request.META.get('REMOTE_ADDR', '')
