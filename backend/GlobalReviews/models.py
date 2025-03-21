from django.db import models
from django.utils.translation import gettext_lazy as _
from UserAuth.models import UserModel

class GlobalReviewsModel(models.Model):
    user = models.ForeignKey(
        UserModel, 
        on_delete=models.CASCADE, 
        verbose_name=_("Пользователь")
    )
    text = models.TextField(_("Текст"))
    created_at = models.DateTimeField(_("Дата создания"), auto_now_add=True)
    is_allowed = models.BooleanField(_("Разрешено"), default=False)
    
    def __str__(self):
        return f"Отзыв от {self.user.email}"

    class Meta:
        verbose_name = _("Отзыв")
        verbose_name_plural = _("Отзывы")
        ordering = ('-id',)
