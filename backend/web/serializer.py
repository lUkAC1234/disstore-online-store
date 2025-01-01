from rest_framework import serializers
from .models import ClothesModel, ClothesColorModel, ClothesSizeModel, ClothesImageModel

class ClothesColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothesColorModel
        fields = ['id', 'color']

class ClothesSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothesSizeModel
        fields = ['id', 'size']

class ClothesImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothesImageModel
        fields = ['id', 'product', 'image']

class ClothesModelSerializer(serializers.ModelSerializer):
    colors = ClothesColorSerializer(many=True, read_only=True)
    sizes = ClothesSizeSerializer(many=True, read_only=True)
    catalogImages = ClothesImageSerializer(many=True, read_only=True)

    class Meta:
        model = ClothesModel
        fields = ['id', 'title', 'description', 'price', 'colors', 'sizes', 'catalogImages']

class ClothesModelCreateUpdateSerializer(serializers.ModelSerializer):
    colors = serializers.PrimaryKeyRelatedField(queryset=ClothesColorModel.objects.all(), many=True)
    sizes = serializers.PrimaryKeyRelatedField(queryset=ClothesSizeModel.objects.all(), many=True)

    class Meta:
        model = ClothesModel
        fields = ['id', 'title', 'description', 'price', 'colors', 'sizes']

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
