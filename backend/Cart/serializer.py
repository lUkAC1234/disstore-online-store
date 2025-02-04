from rest_framework import serializers
from web.serializer import ClothesModelSerializer
from .models import WishlistModel
from web.models import ClothesModel

class WishlistSerializer(serializers.ModelSerializer):
    product = ClothesModelSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = WishlistModel
        fields = ['id', 'product', 'product_id', 'created_at']
        read_only_fields = ['created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        product_id = validated_data.pop('product_id')
        product = ClothesModel.objects.get(id=product_id)
        return WishlistModel.objects.create(user=user, product=product, **validated_data)