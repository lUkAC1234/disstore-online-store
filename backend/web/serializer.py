from rest_framework import serializers
from .models import ClothesModel, ColorModel

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColorModel
        fields = ['id', 'color']  # Explicitly define the fields for ColorModel

class ClothesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothesModel
        fields = '__all__'  