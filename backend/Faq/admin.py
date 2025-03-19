from django.contrib import admin
from .models import (
    FaqModel
)
from unfold.admin import ModelAdmin

@admin.register(FaqModel)
class FaqModelAdmin(ModelAdmin):
    list_display = ['question']
    list_display_links = ['question']
    search_fields = ['question']
    list_filter = ['question']  
