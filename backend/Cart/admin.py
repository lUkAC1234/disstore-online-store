from django.contrib import admin
from .models import (
    WishlistModel
)
from unfold.admin import ModelAdmin

@admin.register(WishlistModel)
class ClothesModelAdmin(ModelAdmin):
    list_display = ['user', 'product', 'created_at']
    list_display_links = ['user', 'product', 'created_at']
    search_fields = ['user', 'product', 'created_at']
    list_filter = ['created_at', 'product']  