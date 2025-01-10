import django_filters
from django.core.exceptions import ValidationError
from .models import ClothesModel

class ClothesModelFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains', label='Title')
    color = django_filters.CharFilter(method='filter_multiple', label='Colors')
    types = django_filters.CharFilter(method='filter_multiple', label='Types')
    size = django_filters.CharFilter(method='filter_multiple', label='Sizes')

    class Meta:
        model = ClothesModel
        fields = ['title', 'color', 'types', 'size']

    def filter_multiple(self, queryset, name, value):
        """
        Generic filter for multiple IDs.
        Automatically determines the related field to filter.
        """
        param_values = self.request.GET.getlist(name)  
        if param_values:
            try:
                ids = [int(id.strip()) for id in param_values if id.strip().isdigit()]

                field_lookup = {
                    "color": "colors__id__in",
                    "size": "sizes__id__in",
                    "types": "types__id__in"
                }
                if name not in field_lookup:
                    raise ValidationError(f"Invalid filter parameter: {name}")
                query_field = field_lookup[name]
                return queryset.filter(**{query_field: ids}).distinct()
            except ValueError:
                raise ValidationError(f"{name.capitalize()} filter requires valid integer IDs.")
        return queryset