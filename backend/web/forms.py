from django import forms
from django.contrib import admin
from django.utils.html import format_html
from .models import ClothesModel, ClothesColorModel, TypesModel

class ClothesModelForm(forms.ModelForm):
    class Meta:
        model = ClothesModel
        fields = '__all__'
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Кастомизация виджета для цветов
        self.fields['colors'].widget = forms.CheckboxSelectMultiple()
        self.fields['colors'].queryset = ClothesColorModel.objects.all()
        
        self.fields['colors'].widget.choices = [
            (color.id, format_html(
                '<span style="background-color: {}; padding: 2px 5px; color: white; display: inline-block;">{}</span>',
                color.color,
                color.color
            )) for color in ClothesColorModel.objects.all()
        ]
        
        # Кастомизация виджета для типов
        self.fields['types'].widget = forms.CheckboxSelectMultiple()
        self.fields['types'].queryset = TypesModel.objects.all()
        
        self.fields['types'].widget.choices = [
            (type_obj.id, format_html(
                '<img src="{}" style="width: 20px; height: 20px; margin-right: 5px;" /> {}',
                type_obj.image.url if type_obj.image else '#',
                type_obj.title
            )) for type_obj in TypesModel.objects.all()
        ]
