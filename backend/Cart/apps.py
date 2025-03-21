from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class CartConfig(AppConfig):
    name = 'Cart'
    default_auto_field = 'django.db.models.BigAutoField'
    verbose_name = _("«Заказы»")

    def ready(self):
        import Cart.signals 