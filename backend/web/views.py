from rest_framework import status
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView, RetrieveAPIView
from rest_framework.response import Response
from .models import (
    ClothesModel, 
    ClothesColorModel, 
    ClothesSizeModel, 
    ClothesImageModel, 
    TypesModel
)
from .serializer import (
    ClothesModelSerializer,
    ClothesModelCreateUpdateSerializer,
    ClothesColorSerializer,
    ClothesSizeSerializer,
    ClothesImageSerializer,
    ClothesTypeModelSerializer
)

from rest_framework.exceptions import NotFound
import django_filters
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from django.core.exceptions import ValidationError

# Filtering
class ClothesModelFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains', label='Title')
    price_min = django_filters.NumberFilter(field_name='price', lookup_expr='gte', label='Min Price')
    price_max = django_filters.NumberFilter(field_name='price', lookup_expr='lte', label='Max Price')
    color = django_filters.CharFilter(label='Colors', method='filter_color')
    size = django_filters.CharFilter(label='Sizes', method='filter_size')
    type = django_filters.CharFilter(label='Type', method='filter_type')

    class Meta:
        model = ClothesModel
        fields = ['title', 'price_min', 'price_max', 'color', 'size', 'type']

    def filter_color(self, queryset, name, value):
        if value:
            color_ids = value.split(',')
            if not all(id.isdigit() for id in color_ids):
                raise ValidationError("All color IDs must be integers.")
            valid_colors = ClothesColorModel.objects.filter(id__in=color_ids).values_list('id', flat=True)
            queryset = queryset.filter(colors__id__in=list(valid_colors))
        return queryset

    def filter_size(self, queryset, name, value):
        if value:
            size_ids = value.split(',')
            if not all(id.isdigit() for id in size_ids):
                raise ValidationError("All size IDs must be integers.")
            valid_sizes = ClothesSizeModel.objects.filter(id__in=size_ids).values_list('id', flat=True)
            queryset = queryset.filter(sizes__id__in=list(valid_sizes))
        return queryset

    def filter_type(self, queryset, name, value):
        if value:
            if not value.isdigit():
                raise ValidationError("Type ID must be an integer.")
            if not TypesModel.objects.filter(id=value).exists():
                raise ValidationError(f"Invalid type ID: {value}")
            queryset = queryset.filter(type__id=value)
        return queryset


class ClothesMainView(ListAPIView):
    queryset = ClothesModel.objects.prefetch_related('colors', 'sizes', 'catalogImages').all()
    serializer_class = ClothesModelSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filterset_class = ClothesModelFilter
    ordering_fields = ['price', 'title']
    ordering = ['price']

class ClothesModelCreateUpdateView(CreateAPIView, UpdateAPIView, DestroyAPIView):
    queryset = ClothesModel.objects.all()
    serializer_class = ClothesModelCreateUpdateSerializer
    lookup_field = 'slug'

class ClothesColorCreateUpdateView(CreateAPIView, UpdateAPIView, DestroyAPIView):
    queryset = ClothesColorModel.objects.all()
    serializer_class = ClothesColorSerializer

class ClothesSizeCreateUpdateView(CreateAPIView, UpdateAPIView, DestroyAPIView):
    queryset = ClothesSizeModel.objects.all()
    serializer_class = ClothesSizeSerializer

class ClothesImageCreateUpdateView(CreateAPIView, UpdateAPIView, DestroyAPIView):
    queryset = ClothesImageModel.objects.select_related('product').all()
    serializer_class = ClothesImageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()
        
class ClothesModelDetailView(RetrieveAPIView):
    queryset = ClothesModel.objects.prefetch_related('colors', 'sizes', 'catalogImages').all()
    serializer_class = ClothesModelSerializer
    lookup_field = 'slug'

    def get_object(self):
        try:
            return self.queryset.get(slug=self.kwargs.get(self.lookup_field))
        except ClothesModel.DoesNotExist:
            raise NotFound(detail="Clothes not found", code=404)
        
        
class ClothesTypeMainView(ListAPIView):
    queryset = TypesModel.objects.all()
    serializer_class = ClothesTypeModelSerializer
    
class ClothesColorsMainView(ListAPIView):
    queryset = ClothesColorModel.objects.all()
    serializer_class = ClothesColorSerializer
    
class ClothesSizesMainView(ListAPIView):
    queryset = ClothesSizeModel.objects.all()
    serializer_class = ClothesSizeSerializer
