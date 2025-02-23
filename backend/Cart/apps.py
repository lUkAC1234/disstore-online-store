from django.apps import AppConfig


class CartConfig(AppConfig):
    name = 'Cart'
    default_auto_field = 'django.db.models.BigAutoField'

    def ready(self):
        import Cart.signals 