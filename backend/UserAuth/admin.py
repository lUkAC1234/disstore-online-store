from django.contrib import admin
from .models import UserModel
from django.utils.translation import gettext_lazy as _
from unfold.admin import ModelAdmin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm

@admin.register(UserModel)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    list_display = ['id', 'mobile_number', 'is_verified', 'date_joined']
    list_display_links = ['id', 'mobile_number']
    search_fields = ['mobile_number']
    ordering= ['mobile_number']
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm
    fieldsets = (
        (None, {'fields': ('mobile_number', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'is_verified')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('mobile_number', 'password1', 'password2', 'is_staff', 'is_superuser', 'is_verified'),
        }),
    )
    readonly_fields = ('date_joined',)