from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import RegexValidator
from django.utils import timezone
from datetime import timedelta

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Почта обязательна')

        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', True)

        extra_fields['username'] = email

        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Суперпользователь должен иметь is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Суперпользователь должен иметь is_superuser=True')

        return self.create_user(email, password, **extra_fields)
    
class UserModel(AbstractUser):
    mobile_regex = RegexValidator(
        regex=r'^\+998\d{9}$',
        message="Номер должен быть в формате: '+998 12 345 67 89'"
    )
    mobile_number = models.CharField(
        max_length=13,
        validators=[mobile_regex],
        blank=True,
    )
    
    email = models.EmailField(
        unique=True,
        verbose_name="Почта"
    )
    
    def __str__(self):
        return f"{self.username} {self.mobile_number}"

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = UserManager()

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"
        
def pluralize_ru(n, singular, genitive_singular, genitive_plural):
    """
    Returns the correct Russian word form based on the number n.
    Examples:
      pluralize_ru(1, 'секунда', 'секунды', 'секунд') -> 'секунда'
      pluralize_ru(2, 'секунда', 'секунды', 'секунд') -> 'секунды'
      pluralize_ru(5, 'секунда', 'секунды', 'секунд') -> 'секунд'
    """
    n = abs(n)
    if 11 <= n % 100 <= 14:
        return genitive_plural
    last_digit = n % 10
    if last_digit == 1:
        return singular
    elif 2 <= last_digit <= 4:
        return genitive_singular
    else:
        return genitive_plural
        
class VisitHistory(models.Model):
    user = models.ForeignKey(
        UserModel,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        db_index=True
    )
    session_key = models.CharField(
        max_length=40,
        db_index=True,
    )
    ip_address = models.GenericIPAddressField()
    start_time = models.DateTimeField(db_index=True)
    last_seen = models.DateTimeField()
    end_time = models.DateTimeField(db_index=True)
    
    @property
    def is_online(self):
        if self.last_seen:
            return timezone.now() - self.last_seen < timedelta(minutes=1)
        return False


    @property
    def visit_duration(self):
        """
        Calculate the duration of the visit based on the start time and end time.
        """
        if self.start_time and self.end_time:
            return self.end_time - self.start_time
        return None

    class Meta:
        indexes = [
            models.Index(fields=['session_key', 'end_time']),
            models.Index(fields=['end_time', 'user']),
        ]
        ordering = ['-start_time']

    def __str__(self):
        return f"{self.user or 'Anonymous'} {self.start_time:%Y-%m-%d %H:%M} → {self.end_time:%H:%M}"
    