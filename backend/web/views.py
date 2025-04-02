from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from .models import (
    ClothesModel, 
    ClothesColorModel, 
    ClothesSizeModel, 
    TypesModel,
    Banner,
)
from .serializer import (
    ClothesModelSerializer,
    ClothesColorSerializer,
    ClothesSizeSerializer,
    ClothesTypeModelSerializer,
    BannerSerializer,
)

from rest_framework.exceptions import NotFound
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Min, Max
from .filters import ClothesModelFilter, SearchTitle
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
        
class SearchingClothesView(ListAPIView):
    serializer_class = ClothesModelSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = SearchTitle

    def get_queryset(self):
        return ClothesModel.objects.prefetch_related('colors', 'sizes', 'types', 'catalogImages')
        
class NewClothesView(ListAPIView):
    serializer_class = ClothesModelSerializer

    def get_queryset(self):
        return ClothesModel.objects.prefetch_related('colors', 'sizes', 'types', 'catalogImages')\
            .order_by('-created_at')[:9]

class PopularClothesView(ListAPIView):
    serializer_class = ClothesModelSerializer

    def get_queryset(self):
        return ClothesModel.objects.prefetch_related('colors', 'sizes', 'types', 'catalogImages')\
            .order_by('-popularity', '-id')

class ClothesModelDetailView(RetrieveAPIView):
    queryset = ClothesModel.objects.prefetch_related('colors', 'sizes', 'catalogImages').all()
    serializer_class = ClothesModelSerializer
    lookup_field = 'slug'

    def get_object(self):
        try:
            obj = self.queryset.get(slug=self.kwargs.get(self.lookup_field))
            obj.popularity += 1
            obj.save(update_fields=['popularity'])
            return obj
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
    
# BANNERS
class BannerView(ListAPIView):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer