import django_filters
from django.core.exceptions import ValidationError
from .models import ClothesModel
from urllib.parse import unquote
from transliterate import translit
from transliterate.exceptions import LanguageDetectionError
from django.db.models import Q

class ClothesModelFilter(django_filters.FilterSet):
    color = django_filters.CharFilter(method='filter_multiple', label='Colors')
    types = django_filters.CharFilter(method='filter_multiple', label='Types')
    size = django_filters.CharFilter(method='filter_multiple', label='Sizes')
    price_min = django_filters.NumberFilter(field_name='real_price', lookup_expr='gte', label='Minimum Price')
    price_max = django_filters.NumberFilter(field_name='real_price', lookup_expr='lte', label='Maximum Price')

    class Meta:
        model = ClothesModel
        fields = ['color', 'types', 'size', 'price_min', 'price_max']
        
    def filter_multiple(self, queryset, name, value):
        """
        Generic filter for multiple IDs.
        Automatically determines the related field to filter.
        """

        param_values = self.request.GET.getlist(name)
        if param_values:
            try:
                decoded_values = [unquote(value).strip() for value in param_values]
                ids = [int(id) for id in decoded_values if id.isdigit()]
                
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

class SearchTitle(django_filters.FilterSet):
    title = django_filters.CharFilter(method='filter_title', label='Title')
    class Meta:
        model = ClothesModel
        fields = ['title']
        
    def filter_title(self, queryset, name, value):
        """
        Filters the title field by transliterating the input if possible and
        searching in both original and transliterated forms.
        """
        try:
            transliterated_value = translit(value, language_code='ru').lower()
        except LanguageDetectionError:
            transliterated_value = value.lower()

        return queryset.filter(
            Q(title__icontains=transliterated_value) | Q(title__icontains=value.lower())
        )