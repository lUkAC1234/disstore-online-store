from rest_framework import serializers
from web.serializer import ClothesModelSerializer
from .models import WishlistModel
from web.models import ClothesModel

class WishlistSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(write_only=True)
    product = ClothesModelSerializer(read_only=True)

    class Meta:
        model = WishlistModel
        fields = ['id', 'product', 'product_id', 'quantity', 'created_at']
        read_only_fields = ['id', 'product', 'quantity', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        product_id = validated_data.pop('product_id')
        try:
            product = ClothesModel.objects.get(id=product_id)
        except ClothesModel.DoesNotExist:
            raise serializers.ValidationError("Продукт не найден")
        wishlist_item, created = WishlistModel.objects.get_or_create(
            user=user,
            product=product,
            defaults={'quantity': 1}
        )
        if not created:
            wishlist_item.quantity += 1
            wishlist_item.save()
        return wishlist_item