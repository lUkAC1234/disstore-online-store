from rest_framework import serializers
from .models import ClothesModel

class ClothesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothesModel
        fields = '__all__'  