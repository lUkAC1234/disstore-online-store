from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class UserModel(AbstractUser):
    pass

class ClothesModel(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.PositiveIntegerField()
    colors = models.ManyToManyField('ColorModel', related_name='clothes')
    
    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Одежда'
        verbose_name_plural = 'Одежды'
        ordering = ('-id',)
        
class ColorModel(models.Model):
    color = models.CharField(max_length=100)
    
    def __str__(self):
        return self.color

    class Meta:
        verbose_name = 'Цвет'
        verbose_name_plural = 'Цвета'
        ordering = ('-id',)

class ClothesImage(models.Model):
    product = models.ForeignKey(ClothesModel, on_delete=models.CASCADE, related_name='catalogImages')
    image = models.ImageField(upload_to='clothes/images/%Y/%m/%d/')
    
    def __str__(self):
        return f"Image for {self.product.title}"