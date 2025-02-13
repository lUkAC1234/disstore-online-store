from django.contrib import admin
from .models import UserModel, VisitHistory
from django.utils.translation import gettext_lazy as _
from unfold.admin import ModelAdmin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm
from django.utils.html import format_html

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
    
@admin.register(VisitHistory)
class VisitHistoryAdmin(ModelAdmin):
    # Replace 'timestamp' with 'start_time' which exists in the model.
    list_display = ('user', 'ip_address', 'get_visit_duration', 'is_online_status', 'start_time')
    list_filter = ('user', 'start_time', 'ip_address')
    search_fields = ('user__username', 'ip_address')
    readonly_fields = ('user', 'ip_address', 'start_time', 'end_time', 'is_online_status')

    def get_visit_duration(self, obj):
        return obj.visit_duration
    get_visit_duration.short_description = 'Visit Duration'

    def is_online_status(self, obj):
        if obj.is_online:
            return format_html(
                '<span class="user_online_status" style="color: white; background: green; padding: 0.25rem 1rem;">Online</span>'
            )
        else:
            return format_html(
                '<span class="user_offline_status" style="color: white; background: red; padding: 0.25rem 1rem;">Offline</span>'
            )
    is_online_status.short_description = 'Online Status'