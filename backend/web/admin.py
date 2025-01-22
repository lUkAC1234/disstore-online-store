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
from django.utils.safestring import mark_safe
from django.utils.html import format_html
from .forms import ClothesModelForm
from unfold.admin import ModelAdmin, TabularInline
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from import_export.admin import ImportExportModelAdmin
from unfold.contrib.import_export.forms import ExportForm, ImportForm, SelectableFieldsExportForm
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm
from django.contrib.auth.models import Group
from django.contrib.auth.admin import GroupAdmin as BaseGroupAdmin

admin.site.unregister(Group) 

@admin.register(Group)
class CustomGroupAdmin(BaseGroupAdmin, ModelAdmin):
    pass




@admin.register(UserModel)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    list_display = ['id', 'username']
    list_display_links = ['id', 'username']
    search_fields = ['username']
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm
    
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

