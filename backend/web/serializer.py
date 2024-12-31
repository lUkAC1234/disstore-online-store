from rest_framework import serializers
from .models import ClothesModel, ColorModel, ClothesImage

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColorModel
        fields = ['id', 'color']  # Explicitly define the fields for ColorModel

class ClothesImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothesImage
        fields = ['id', 'image']  # Explicitly define the fields for ClothesImage model

class ClothesModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothesModel
        fields = ['id', 'title', 'description', 'price', 'catalogImages']  # Explicitly define the fields for ClothesModel
