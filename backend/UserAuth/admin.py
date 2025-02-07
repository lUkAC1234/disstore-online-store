from django.contrib import admin
from .models import UserModel
from django.utils.translation import gettext_lazy as _
from unfold.admin import ModelAdmin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm

@admin.register(UserModel)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    list_display = ['id', 'username', 'mobile_number', 'date_joined']
    list_display_links = ['id', 'username', 'mobile_number']
    search_fields = ['username', 'mobile_number']
    ordering = ['username', 'mobile_number']
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm
    readonly_fields = ('date_joined',)

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email', 'mobile_number')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'mobile_number', 'password1', 'password2'),
        }),
    )