from django.contrib import admin
from .models import (
    ClothesModel, 
    ClothesColorModel, 
    ClothesSizeModel,
    ClothesImageModel,
    TypesModel, 
    ClothesReviewModel,
    ClothesFAQModel,
    Banner,
)
from django.utils.translation import gettext_lazy as _
from django.utils.safestring import mark_safe
from .forms import ClothesModelForm
from unfold.admin import ModelAdmin, TabularInline
from import_export.admin import ImportExportModelAdmin
from unfold.contrib.import_export.forms import ExportForm, ImportForm, SelectableFieldsExportForm
from django.contrib.auth.models import Group
from django.contrib.auth.admin import GroupAdmin as BaseGroupAdmin

admin.site.unregister(Group) 

@admin.register(Group)
class CustomGroupAdmin(BaseGroupAdmin, ModelAdmin):
    pass
    
class ClothesImageInline(TabularInline):
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
class ClothesModelAdmin(ModelAdmin, ImportExportModelAdmin):
    form = ClothesModelForm
    list_display = ['id', 'title']
    list_display_links = ['id', 'title']
    search_fields = ['title']
    prepopulated_fields = {'slug': ('title', )}
    readonly_fields = ['real_price']
    inlines = [ClothesImageInline]
    import_form_class = ImportForm
    export_form_class = SelectableFieldsExportForm
    list_filter = ['created_at', 'title']  
    
      
    
@admin.register(ClothesColorModel)
class ClothesColorModelAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['id', 'hex', 'name', 'color']
    list_display_links = ['id', 'hex', 'name', 'color']
    search_fields = ['hex']
    import_form_class = ImportForm
    export_form_class = ExportForm

    def hex(self, obj):
        return mark_safe(
            f"<div style='background-color: {obj.color}; width: 3rem; height: 3rem; border-radius: 0.5rem;'></div>")


@admin.register(ClothesSizeModel)
class ClothesSizeModelAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['id', 'size']
    list_display_links = ['id', 'size']
    search_fields = ['size']
    import_form_class = ImportForm
    export_form_class = ExportForm
    
@admin.register(ClothesImageModel)
class ClothesImageModelAdmin(ModelAdmin):
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
class ClothesTypeModelAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['id', 'title']
    list_display_links = ['id', 'title']
    search_fields = ['title']
    import_form_class = ImportForm
    export_form_class = ExportForm

@admin.register(ClothesReviewModel)
class ClothesReviewModelAdmin(ModelAdmin):
    list_display = ['id', 'product', 'user']
    list_display_links = ['id', 'product', 'user']
    search_fields = ['product__title', 'user__username']

@admin.register(ClothesFAQModel)
class ClothesFAQModelAdmin(ModelAdmin):
    list_display = ['id', 'product']
    list_display_links = ['id', 'product']
    search_fields = ['product__title']

# BANNERS
@admin.register(Banner)
class BannersModelAdmin(ModelAdmin):
    list_display = ['id', 'file_preview', 'get_types_titles']
    list_display_links = ['id', 'get_types_titles']
    search_fields = ['types__title']
    list_filter = ['types__title']  
    readonly_fields = ['file_preview']  

    def file_preview(self, obj):
        if obj.file:
            ext = obj.file.name.split('.')[-1].lower()
            if ext in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
                return mark_safe(f'<img src="{obj.file.url}" style="max-width: 250px; aspect-ratio: 16/9;" />')
            elif ext in ['mp4', 'mov', 'avi']:
                return mark_safe(
                    f'<video width="250" style="aspect-ratio: 16/9;" controls>'
                    f'<source src="{obj.file.url}" type="video/mp4">'
                    f'Ваш браузер не поддерживает видео.'
                    f'</video>'
                )
        return "Нет изображения"
    file_preview.short_description = "Превью"
    
    def get_types_titles(self, obj):
        return ", ".join(obj.types.values_list('title', flat=True))
    get_types_titles.short_description = "Тип одежды"