from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

class WebConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'web'
    verbose_name = _("«Одежда»")
    
    def ready(self):
        from .signals import real_price
