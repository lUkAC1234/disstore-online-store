from rest_framework import serializers
from web.serializer import ClothesModelSerializer
from .models import WishlistModel, Cart, CartItem
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

class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(write_only=True)
    product = ClothesModelSerializer(read_only=True)
    # Include the new fields with defaults:
    selected_color = serializers.CharField(required=False, allow_blank=True, default="")
    selected_size = serializers.CharField(required=False, allow_blank=True, default="")
    selected_image = serializers.URLField(required=False, allow_null=True, default=None)

    class Meta:
        model = CartItem
        fields = [
            'id', 'product', 'product_id', 'quantity',
            'selected_color', 'selected_size', 'selected_image',
            'created_at'
        ]
        read_only_fields = ['id', 'product', 'created_at']
        
    def create(self, validated_data):
        # Debug: show raw validated_data before popping
        print("Raw validated_data:", repr(validated_data))
        
        request = self.context.get('request')
        user = request.user
        product_id = validated_data.pop('product_id')
        cart, _ = Cart.objects.get_or_create(user=user)
        
        try:
            product = ClothesModel.objects.get(id=product_id)
        except ClothesModel.DoesNotExist:
            raise serializers.ValidationError("Product not found.")
        
        # Pop the extra fields so they are removed from validated_data.
        # If not provided (or provided as None), use our defaults.
        selected_color = validated_data.pop('selected_color', "") or ""
        selected_size = validated_data.pop('selected_size', "") or ""
        selected_image = validated_data.pop('selected_image', None)  # Let None remain None.
        
        # Debug: print sanitized values with repr to see empty strings vs None
        print("Sanitized options:", repr(selected_color), repr(selected_size), repr(selected_image))
        
        # Create or update the cart item.
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            selected_color=selected_color,
            selected_size=selected_size,
            selected_image=selected_image,
            defaults={'quantity': validated_data.get('quantity', 1)}
        )
        if not created:
            cart_item.quantity += validated_data.get('quantity', 1)
            cart_item.save()
        return cart_item




class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    original_total = serializers.SerializerMethodField()
    total_discount = serializers.SerializerMethodField()
    final_total = serializers.SerializerMethodField()
    discount_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            'id', 
            'user', 
            'items', 
            'updated_at', 
            'original_total', 
            'total_discount', 
            'final_total', 
            'discount_percentage'
        ]
        read_only_fields = fields

    def get_original_total(self, obj):
        # Sum of (original price * quantity) for all items
        return sum(item.product.price * item.quantity for item in obj.items.all())

    def get_total_discount(self, obj):
        # Calculate discount as (price - real_price) * quantity for each item
        return sum((item.product.price - item.product.real_price) * item.quantity for item in obj.items.all())

    def get_final_total(self, obj):
        return self.get_original_total(obj) - self.get_total_discount(obj) + 50000

    def get_discount_percentage(self, obj):
        original = self.get_original_total(obj)
        total_discount = self.get_total_discount(obj)
        if original > 0:
            return round((total_discount / original) * 100, 2)
        return 0