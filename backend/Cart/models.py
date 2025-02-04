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
        unique_together = ['user', 'product']
        verbose_name = _("Список желаний")
        verbose_name_plural = _("Списки желаний")

    def __str__(self):
        return f"{self.user} - {self.product}"