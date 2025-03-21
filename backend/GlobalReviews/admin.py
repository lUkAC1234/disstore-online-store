from django.contrib import admin
from .models import GlobalReviewsModel
from django.utils.translation import gettext_lazy as _
from unfold.admin import ModelAdmin

@admin.register(GlobalReviewsModel)
class ClothesReviewModelAdmin(ModelAdmin):
    list_display = ['id', 'user']
    list_display_links = ['id', 'user']
    search_fields = ['user__username']