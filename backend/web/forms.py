from django import forms
from django.contrib import admin
from django.utils.html import format_html
from .models import ClothesModel, ClothesColorModel, TypesModel
from unfold.widgets import UnfoldAdminCheckboxSelectMultiple

class ClothesModelForm(forms.ModelForm):
    class Meta:
        model = ClothesModel
        fields = '__all__'
        widgets = {
            'colors': UnfoldAdminCheckboxSelectMultiple(),
            'types': UnfoldAdminCheckboxSelectMultiple(),
            # 'sizes': UnfoldAdminCheckboxSelectMultiple(),
        }
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Кастомизация виджета для цветов
        self.fields['colors'].queryset = ClothesColorModel.objects.all()
        
        self.fields['colors'].widget.choices = [
            (color.id, format_html(
                '<span style="background-color: {}; width: 3rem; height: 3rem; border-radius: 0.5rem; display: inline-block;"></span>',
                color.color,
                color.color
            )) for color in ClothesColorModel.objects.all()
        ]
      
        # Кастомизация виджета для типов
        self.fields['types'].queryset = TypesModel.objects.all()
        
        self.fields['types'].widget.choices = [
            (type_obj.id, format_html(
                '<div style="display: flex; flex-flow: column; justify-content: center; align-items: center;"><img src="{}" style="width: 5rem; height: 5rem; object-fit: cover; margin-right: 5px;" /> {}</div>',
                type_obj.image.url if type_obj.image else '#',
                type_obj.title
            )) for type_obj in TypesModel.objects.all()
        ]
