from django.contrib import admin
from .models import (
    UserModel, 
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