from django.db import models
from UserAuth.models import UserModel
from web.models import ClothesModel
from django.utils.translation import gettext_lazy as _

class WishlistModel(models.Model):
    user = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        related_name='wishlists',
        verbose_name=_("Пользователь")
    )
    product = models.ForeignKey(
        ClothesModel,
        on_delete=models.CASCADE,
        related_name='wishlists',
        verbose_name=_("Продукт")
    )
    
    quantity = models.PositiveIntegerField(default=1, verbose_name=_("Количество"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Дата добавления"))

    class Meta:
        verbose_name = _("Список желаний")
        verbose_name_plural = _("Списки желаний")

    def __str__(self):
        return f"{self.user} - {self.product}"
    
    
# CART

class Cart(models.Model):
    user = models.OneToOneField(UserModel, on_delete=models.CASCADE, related_name='cart')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart of {self.user.email}"
    
    class Meta: 
        verbose_name = _("Корзина")
        verbose_name_plural = _("Корзина")

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(ClothesModel, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    selected_color = models.CharField(max_length=50, blank=True, default="")
    selected_size = models.CharField(max_length=50, blank=True, default="")
    selected_image = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('cart', 'product', 'selected_color', 'selected_size', 'selected_image')
        ordering = ['-created_at']
        verbose_name = _("Товары корзины")
        verbose_name_plural = _("Товары корзины")

    def __str__(self):
        return f"{self.product} x {self.quantity}"