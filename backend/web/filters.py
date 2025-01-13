import django_filters
from django.core.exceptions import ValidationError
from .models import ClothesModel
from django.db.models import Min, Max

class ClothesModelFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains', label='Title')
    color = django_filters.CharFilter(method='filter_multiple', label='Colors')
    types = django_filters.CharFilter(method='filter_multiple', label='Types')
    size = django_filters.CharFilter(method='filter_multiple', label='Sizes')
    price_min = django_filters.NumberFilter(field_name='real_price', lookup_expr='gte', label='Minimum Price')
    price_max = django_filters.NumberFilter(field_name='real_price', lookup_expr='lte', label='Maximum Price')

    class Meta:
        model = ClothesModel
        fields = ['title', 'color', 'types', 'size', 'price_min', 'price_max']

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
                return queryset.filter(**{field_lookup[name]: ids}).distinct()
            except ValueError:
                raise ValidationError(f"{name.capitalize()} filter requires valid integer IDs.")
        return queryset