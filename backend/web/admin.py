from django.contrib import admin
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
from django.utils.translation import gettext_lazy as _
# For saving html code
from django.utils.safestring import mark_safe
from django.utils.html import format_html
# from modeltranslation.admin import TranslationAdmin

# --------------------------------------------------------------------------- #
# User Model Admin
@admin.register(UserModel)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username']
    list_display_links = ['id', 'username']
    search_fields = ['username']
    
class ClothesImageInline(admin.TabularInline):
    model = ClothesImageModel
    extra = 4  
    fields = ['image', 'image_preview']
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            return mark_safe(f'<img src="{obj.image.url}" style="max-height: 100px; max-width: 150px;" />')
        return "Нет изображения"
    image_preview.short_description = "Превью"

@admin.register(ClothesModel)
class ClothesModelAdmin(admin.ModelAdmin):
    list_display = ['id', 'title']
    list_display_links = ['id', 'title']
    search_fields = ['title']
    prepopulated_fields = {'slug': ('title', )}
    readonly_fields = ['real_price']
    inlines = [ClothesImageInline]
    
@admin.register(ClothesColorModel)
class ClothesColorModelAdmin(admin.ModelAdmin):
    list_display = ['id', 'hex', 'color']
    list_display_links = ['id', 'hex', 'color']
    search_fields = ['hex']

    def hex(self, obj):
        return mark_safe(
            f"<div style='background-color: {obj.color}; width: 30px; height: 30px; border-radius: 50%; box-shadow: 0 5px 10px rgb(0 0 0 / 20%);'></div>")


@admin.register(ClothesSizeModel)
class ClothesSizeModelAdmin(admin.ModelAdmin):
    list_display = ['id', 'size']
    list_display_links = ['id', 'size']
    search_fields = ['size']
    
@admin.register(ClothesImageModel)
class ClothesImageModelAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'image_preview']
    list_display_links = ['id', 'product']
    search_fields = ['product__title']
    list_filter = ['product']  
    readonly_fields = ['image_preview']  

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" style="max-height: 100px; max-width: 150px;" />')
        return "Нет изображения"
    image_preview.short_description = "Превью"
    
    
@admin.register(TypesModel)
class ClothesTypeModelAdmin(admin.ModelAdmin):
    list_display = ['id', 'title']
    list_display_links = ['id', 'title']
    search_fields = ['title']

@admin.register(ClothesReviewModel)
class ClothesReviewModelAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'user']
    list_display_links = ['id', 'product', 'user']
    search_fields = ['product__title', 'user__username']

@admin.register(ClothesFAQModel)
class ClothesFAQModelAdmin(admin.ModelAdmin):
    list_display = ['id', 'product']
    list_display_links = ['id', 'product']
    search_fields = ['product__title']


admin.site.site_header = 'DISSTORE.UZ'
admin.site.site_title = 'DISSTORE.UZ'