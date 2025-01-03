from django.db.models.signals import pre_save
from .models import ClothesModel
from django.dispatch import receiver
# --------------------------------------------------------------------------- #

# --------------------------------------------------------------------------- #

@receiver(pre_save, sender=ClothesModel)
def real_price(sender, instance, **kwargs):
    if instance.discount > 0:
        instance.real_price = instance.price - (instance.discount / 100) * instance.price
    else:
        instance.real_price = instance.price

