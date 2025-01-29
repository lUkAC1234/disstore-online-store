from rest_framework import status, generics, permissions, status
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView, RetrieveAPIView
from rest_framework.response import Response
from .models import (
    ClothesModel, 
    ClothesColorModel, 
    ClothesSizeModel, 
    ClothesImageModel, 
    TypesModel,
    WishlistModel
)
from .serializer import (
    ClothesModelSerializer,
    ClothesModelCreateUpdateSerializer,
    ClothesColorSerializer,
    ClothesSizeSerializer,
    ClothesImageSerializer,
    ClothesTypeModelSerializer,
    WishlistSerializer,
)

from rest_framework.exceptions import NotFound
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Min, Max
from .filters import ClothesModelFilter
from rest_framework.pagination import PageNumberPagination


class ResultsSetPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = 'page_size'

    def paginate_queryset(self, queryset, request, view=None):
        if not hasattr(self, 'paginator'):
            self.paginator = self.django_paginator_class(queryset, self.get_page_size(request))
        
        try:
            paginated_queryset = super().paginate_queryset(queryset, request, view)
        except NotFound:
            self.page = self.paginator.page(self.paginator.num_pages)
            self.request = request

        self.total_pages = self.paginator.num_pages
        self.current_page = self.page.number
        return list(self.page)

    def get_paginated_response(self, data):
        response = super().get_paginated_response(data)
        response.data['total_pages'] = self.total_pages
        response.data['current_page'] = self.current_page
        return response

        
class ClothesMainView(ListAPIView):
    serializer_class = ClothesModelSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ClothesModelFilter
    pagination_class = ResultsSetPagination

    def get_queryset(self):
        return ClothesModel.objects.prefetch_related('colors', 'sizes', 'types', 'catalogImages')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        filtered_queryset = self.filter_queryset(queryset)

        price_range = filtered_queryset.aggregate(
            price_min=Min('real_price'),
            price_max=Max('real_price')
        )

        page = self.paginate_queryset(filtered_queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginated_response = self.get_paginated_response(serializer.data)
            paginated_response.data.update({
                'price_min': price_range['price_min'],
                'price_max': price_range['price_max'],
            })
            return paginated_response

        serializer = self.get_serializer(filtered_queryset, many=True)
        return Response({
            'price_min': price_range['price_min'],
            'price_max': price_range['price_max'],
            'results': serializer.data
        })

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

class WishlistListView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WishlistModel.objects.filter(user=self.request.user).select_related('product')

    def perform_create(self, serializer):
        product_id = self.request.data.get('product_id')
        if WishlistModel.objects.filter(user=self.request.user, product_id=product_id).exists():
            raise serializer.ValidationError("Product already in wishlist")
        serializer.save(user=self.request.user)

class WishlistDetailView(generics.DestroyAPIView):
    queryset = WishlistModel.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'product_id'

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)
    