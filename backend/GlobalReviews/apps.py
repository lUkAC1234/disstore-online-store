from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class GlobalreviewsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'GlobalReviews'
    verbose_name = _("«Отзывы о самом магазине»")
