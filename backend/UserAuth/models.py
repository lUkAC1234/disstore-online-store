from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import RegexValidator

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