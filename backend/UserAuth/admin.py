from django.contrib import admin
from .models import UserModel
from django.utils.translation import gettext_lazy as _
from unfold.admin import ModelAdmin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm

@admin.register(UserModel)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    list_display = ['id', 'username']
    list_display_links = ['id', 'username']
    search_fields = ['username']
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm