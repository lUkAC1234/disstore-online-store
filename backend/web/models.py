from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class UserModel(AbstractUser):
    pass

class ClothesModel(models.Model):
    title = models.CharField(_("Название"), max_length=100)
    description = models.TextField(_("Описание"))
    price = models.PositiveIntegerField(_("Цена"))
    colors = models.ManyToManyField(
        'ClothesColorModel', 
        verbose_name=_("Цвета"), 
        related_name='clothes'
    )
    sizes = models.ManyToManyField(
        'ClothesSizeModel', 
        verbose_name=_("Размеры"), 
        related_name='clothes'
    )
    
    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _("Одежда")
        verbose_name_plural = _("Одежды")
        ordering = ('-id',)
        
class ClothesColorModel(models.Model):
    color = models.CharField(_("Цвет"), max_length=100)
    
    def __str__(self):
        return self.color

    class Meta:
        verbose_name = _("Цвет")
        verbose_name_plural = _("Цвета")
        ordering = ('-id',)
        
class ClothesSizeModel(models.Model):
    size = models.CharField(_("Размер"), max_length=100)
    
    def __str__(self):
        return self.size

    class Meta:
        verbose_name = _("Размер")
        verbose_name_plural = _("Размеры")
        ordering = ('-id',)

class ClothesImageModel(models.Model):
    product = models.ForeignKey(
        ClothesModel, 
        on_delete=models.CASCADE, 
        related_name='catalogImages', 
        verbose_name=_("Продукт")
    )
    image = models.ImageField(_("Изображение"), upload_to='clothes/images/%Y/%m/%d/')
    
    def __str__(self):
        return f"Image for {self.product.title}"
    
    class Meta:
        verbose_name = _("Изображение")
        verbose_name_plural = _("Изображения")
        ordering = ('-id',)
