import random
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.core.validators import RegexValidator

class UserManager(BaseUserManager):
    def create_user(self, mobile_number, password=None, **extra_fields):
        if not mobile_number:
            raise ValueError('Мобильный номер обязателен')

        extra_fields.setdefault('is_active', True)
        user = self.model(mobile_number=mobile_number, **extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, mobile_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(mobile_number, password, **extra_fields)
    
class UserModel(AbstractBaseUser, PermissionsMixin):
    mobile_regex = RegexValidator(
        regex=r'^\+998\d{9}$',
        message="Номер должен быть в формате: '+998 12 345 67 89'"
    )
    mobile_number = models.CharField(
        max_length=13,
        unique=True,
        validators=[mobile_regex],
    )
    otp = models.CharField(max_length=6, null=True, blank=True)
    otp_expiration = models.DateTimeField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    otp_attempts = models.IntegerField(default=0) 
    last_otp_sent = models.DateTimeField(null=True, blank=True)  

    USERNAME_FIELD = 'mobile_number'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.mobile_number

    def generate_otp(self):
        now = timezone.now()

        # if self.last_otp_sent and (now - self.last_otp_sent).total_seconds() > 3600:
        #     self.otp_attempts = 0

        # if self.otp_attempts >= 3:
        #     raise ValueError("Вы превысили лимит попыток. Повторите через 1 час.")

        self.otp = str(random.randint(100000, 999999))
        self.otp_expiration = now + timezone.timedelta(minutes=5)
        self.otp_attempts += 1
        self.last_otp_sent = now
        self.save()

        try:
            from twilio.rest import Client
            from django.conf import settings

            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            message = client.messages.create(
                from_=settings.TWILIO_PHONE_NUMBER,
                body=f'Ваш код для верификации в disstore.uz: {self.otp}',
                to=self.mobile_number
            )
            print(f"SMS sent to {self.mobile_number}: {message.sid}")
        except Exception as e:
            print(f"Failed to send SMS: {str(e)}")

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"