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
from django.db.models import Q

# Filtering
class ClothesModelFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains', label='Title')
    price_min = django_filters.NumberFilter(field_name='price', lookup_expr='gte', label='Min Price')
    price_max = django_filters.NumberFilter(field_name='price', lookup_expr='lte', label='Max Price')
    color = django_filters.CharFilter(label='Colors', method='filter_color')
    types = django_filters.CharFilter(label='Types', method='filter_type')
    size = django_filters.CharFilter(label='Sizes', method='filter_size')

    class Meta:
        model = ClothesModel
        fields = ['title', 'price_min', 'price_max', 'color', 'types', 'size']

    def filter_color(self, queryset, name, value):
        """Filter by color IDs."""
        color_ids = self.request.GET.getlist('color')  # Get all color IDs from query
        if color_ids:
            if not all(id.isdigit() for id in color_ids):
                raise ValidationError("All color IDs must be integers.")
            # Filter the queryset for valid color IDs
            queryset = queryset.filter(colors__id__in=color_ids).distinct()
        return queryset
    
    def filter_type(self, queryset, name, value):
        """Filter by type IDs."""
        type_ids = self.request.GET.getlist('types')  # Get all type IDs from query
        if type_ids:
            if not all(id.isdigit() for id in type_ids):
                raise ValidationError("All type IDs must be integers.")
            # Filter the queryset for valid type IDs
            queryset = queryset.filter(types__id__in=type_ids).distinct()
        return queryset

    def filter_size(self, queryset, name, value):
        """Filter by size IDs."""
        size_ids = self.request.GET.getlist('size')  # Get all size IDs from query
        if size_ids:
            if not all(id.isdigit() for id in size_ids):
                raise ValidationError("All size IDs must be integers.")
            # Filter the queryset for valid size IDs
            queryset = queryset.filter(sizes__id__in=size_ids).distinct()
        return queryset

class ClothesMainView(ListAPIView):
    serializer_class = ClothesModelSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filterset_class = ClothesModelFilter
    ordering_fields = ['price', 'title']
    ordering = ['price']

    def get_queryset(self):
        return ClothesModel.objects.prefetch_related('colors', 'sizes', 'types', 'catalogImages')


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
