from rest_framework import serializers
from .models import (
    ClothesModel, 
    ClothesColorModel, 
    ClothesSizeModel, 
    ClothesImageModel,
    TypesModel,
    ClothesReviewModel, 
    ClothesFAQModel, 
)
from UserAuth.serializer import RegisterSerializer

class ClothesColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothesColorModel
        fields = ['id', 'color', 'name']

class ClothesSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothesSizeModel
        fields = ['id', 'size']

class ClothesImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothesImageModel
        fields = ['id', 'product', 'image', 'thumbnail']

class ClothesTypeModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypesModel
        fields = ['id', 'title', 'image']
        
class ClothesReviewModelSerializer(serializers.ModelSerializer):
    user = RegisterSerializer(read_only=True)
    class Meta:
        model = ClothesReviewModel
        fields = ['id', 'product', 'user', 'text', 'created_at', 'is_allowed']

class ClothesFAQModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothesFAQModel
        fields = ['id', 'product', 'question', 'answer']

class ClothesModelSerializer(serializers.ModelSerializer):
    colors = ClothesColorSerializer(many=True, read_only=True)
    sizes = ClothesSizeSerializer(many=True, read_only=True)
    types = ClothesTypeModelSerializer(many=True, read_only=True)
    catalogImages = ClothesImageSerializer(many=True, read_only=True)
    reviews = ClothesReviewModelSerializer(many=True)
    faqs = ClothesFAQModelSerializer(many=True, read_only=True)

    class Meta:
        model = ClothesModel
        fields = ['id', 
                  'title', 
                  'slug',
                  'short_description', 
                  'long_description',
                  'price', 
                  'discount', 
                  'real_price', 
                  'count',
                  'colors', 
                  'sizes', 
                  'types', 
                  'catalogImages',
                  'reviews',
                  'faqs'
                  ]