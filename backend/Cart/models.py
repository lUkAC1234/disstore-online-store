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
    
# Order
class OrderStatus(models.TextChoices):
    PENDING = "pending", _("Ожидается")
    CONFIRMED = "confirmed", _("Подтвержден")
    PROCESSING = "processing", _("В обработке")
    SHIPPED = "shipped", _("Отправлено")
    DELIVERED = "delivered", _("Доставлено")
    CANCELED = "canceled", _("Отменено")

class Order(models.Model):
    user = models.ForeignKey(
        UserModel, on_delete=models.CASCADE, related_name='orders'
    )
    full_name = models.CharField(_("ФИО"), max_length=255)
    address = models.TextField(_("Адрес доставки"))
    phone = models.CharField(_("Телефон"), max_length=50)
    email = models.EmailField(_("Электронная почта"))
    status = models.CharField(
        _("Статус"),
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING,
    )
    created_at = models.DateTimeField(_("Создан"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Обновлен"), auto_now=True)

    class Meta:
        verbose_name = _("Заказ")
        verbose_name_plural = _("Заказы")

    def __str__(self):
        return f"Заказ {self.pk} от {self.user.email}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', verbose_name=_('Заказ'))
    product = models.ForeignKey(ClothesModel, on_delete=models.CASCADE, verbose_name=_('Продукт'))
    quantity = models.PositiveIntegerField(_("Количество"), default=1)
    selected_color = models.CharField(_("Выбранный цвет"), max_length=50, blank=True, default="")
    selected_size = models.CharField(_("Выбранный размер"), max_length=50, blank=True, default="")
    selected_image = models.URLField(_("Выбранное изображение"), blank=True, null=True)
    unit_price = models.DecimalField(_("Цена за единицу"), max_digits=10, decimal_places=2)
    total_price = models.DecimalField(_("Общая цена"), max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = _("Товар заказа")
        verbose_name_plural = _("Товары заказа")

    def __str__(self):
        return f"{self.product} x {self.quantity}"