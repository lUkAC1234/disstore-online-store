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
from django_filters.rest_framework import DjangoFilterBackend
from django.core.exceptions import ValidationError
from django.db.models import Min, Max, Q
from .filters import ClothesModelFilter

class ClothesMainView(ListAPIView):
    serializer_class = ClothesModelSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ClothesModelFilter

    def get(self, request, *args, **kwargs):
        queryset = ClothesModel.objects.prefetch_related('colors', 'sizes', 'types', 'catalogImages')

        price_range = queryset.aggregate(
            price_min=Min('real_price'),
            price_max=Max('real_price')
        )

        try:
            price_min_query = float(request.GET.get('price_min', price_range['price_min']))
            price_max_query = float(request.GET.get('price_max', price_range['price_max']))

            if price_min_query < price_range['price_min']:
                raise ValidationError(f"Min price cannot be lower than {price_range['price_min']}.")
            if price_max_query > price_range['price_max']:
                raise ValidationError(f"Max price cannot be higher than {price_range['price_max']}.")

            queryset = queryset.filter(
                real_price__gte=price_min_query,
                real_price__lte=price_max_query
            )
        except ValueError:
            raise ValidationError("Invalid value for 'price_min' or 'price_max'.")

        filtered_queryset = self.filterset_class(data=request.GET, queryset=queryset, request=request).qs
        serializer = self.get_serializer(filtered_queryset, many=True)
        response_data = {
            'price_min': price_range['price_min'],
            'price_max': price_range['price_max'],
            'products': serializer.data
        }

        return Response(response_data)
    
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
