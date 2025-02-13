from django.contrib import admin
from .models import (
    WishlistModel,
    Cart,
    CartItem
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