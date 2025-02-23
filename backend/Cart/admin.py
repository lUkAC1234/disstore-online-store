from django.contrib import admin
from .models import (
    WishlistModel,
    Cart,
    CartItem,
    Order,
    OrderItem,
)
from unfold.admin import ModelAdmin

@admin.register(WishlistModel)
class WishlistModelAdmin(ModelAdmin):
    list_display = ['user', 'product', 'created_at']
    list_display_links = ['user', 'product', 'created_at']
    search_fields = ['user', 'product', 'created_at']
    list_filter = ['created_at', 'product']  
    
@admin.register(Cart)
class CartListModelAdmin(ModelAdmin):
    list_display = ['user']
    list_display_links = ['user']
    search_fields = ['user']
    
@admin.register(CartItem)
class CartItemModelAdmin(ModelAdmin):
    list_display = ['product', 'created_at']
    list_display_links = ['product', 'created_at']
    search_fields = ['product', 'created_at']
    list_filter = ['created_at', 'product']  
    
@admin.register(Order)
class OrderAdmin(ModelAdmin):
    list_display = ['id', 'user', 'full_name', 'address', 'phone', 'email', 'status', 'created_at']
    list_display_links = ['id', 'user']
    search_fields = ['user__email', 'full_name', 'address', 'phone', 'email']
    list_filter = ['status', 'created_at']

@admin.register(OrderItem)
class OrderItemAdmin(ModelAdmin):
    list_display = ['order', 'product', 'quantity', 'unit_price', 'total_price']
    list_display_links = ['order', 'product']
    search_fields = ['order__id', 'product__title']
    list_filter = ['order__created_at', 'product']