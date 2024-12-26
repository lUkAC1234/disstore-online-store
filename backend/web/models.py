from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class UserModel(AbstractUser):
    pass

class ClothesModel(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.PositiveIntegerField()
    image = models.ImageField(upload_to='clothes/image/%Y/%m/%d/')
    
    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Одежда'
        verbose_name_plural = 'Одежды'
        ordering = ('-id',)