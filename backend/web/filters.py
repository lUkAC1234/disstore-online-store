import django_filters
from django.core.exceptions import ValidationError
from .models import ClothesModel

class ClothesModelFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains', label='Title')
    color = django_filters.CharFilter(method='filter_color')
    types = django_filters.CharFilter(method='filter_type')  
    size = django_filters.CharFilter(method='filter_size') 

    class Meta:
        model = ClothesModel
        fields = ['title', 'color', 'types', 'size']

    def filter_color(self, queryset, name, value):
        """Filter by color IDs."""
        try:
            # Parse comma-separated values
            color_ids = [int(id.strip()) for id in value.split(",") if id.strip().isdigit()]
            return queryset.filter(colors__id__in=color_ids).distinct()
        except Exception:
            raise ValidationError("Color filter requires valid integer IDs separated by commas.")

    def filter_type(self, queryset, name, value):
        """Filter by type IDs."""
        try:
            type_ids = [int(id.strip()) for id in value.split(",") if id.strip().isdigit()]
            return queryset.filter(types__id__in=type_ids).distinct()
        except Exception:
            raise ValidationError("Type filter requires valid integer IDs separated by commas.")

    def filter_size(self, queryset, name, value):
        """Filter by size IDs."""
        try:
            size_ids = [int(id.strip()) for id in value.split(",") if id.strip().isdigit()]
            return queryset.filter(sizes__id__in=size_ids).distinct()
        except Exception:
            raise ValidationError("Size filter requires valid integer IDs separated by commas.")
