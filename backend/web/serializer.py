from rest_framework import serializers
from .models import (
    UserModel,
    ClothesModel, 
    ClothesColorModel, 
    ClothesSizeModel, 
    ClothesImageModel,
    TypesModel,
    ClothesReviewModel, 
    ClothesFAQModel
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

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
    user = UserSerializer(read_only=True)
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

class ClothesModelCreateUpdateSerializer(serializers.ModelSerializer):
    colors = serializers.PrimaryKeyRelatedField(queryset=ClothesColorModel.objects.all(), many=True)
    sizes = serializers.PrimaryKeyRelatedField(queryset=ClothesSizeModel.objects.all(), many=True)

    class Meta:
        model = ClothesModel
        fields = [
            'id', 
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
        ]

    def create(self, validated_data):
        colors = validated_data.pop('colors', [])
        sizes = validated_data.pop('sizes', [])
        clothes = ClothesModel.objects.create(**validated_data)
        clothes.colors.set(colors)
        clothes.sizes.set(sizes)
        return clothes

    def update(self, instance, validated_data):
        colors = validated_data.pop('colors', None)
        sizes = validated_data.pop('sizes', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if colors is not None:
            instance.colors.set(colors)
        if sizes is not None:
            instance.sizes.set(sizes)

        instance.save()
        return instance
