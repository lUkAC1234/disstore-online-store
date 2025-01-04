from rest_framework import status
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView, RetrieveAPIView
from rest_framework.response import Response
from .models import ClothesModel, ClothesColorModel, ClothesSizeModel, ClothesImageModel, TypesModel
from .serializer import (
    ClothesModelSerializer,
    ClothesModelCreateUpdateSerializer,
    ClothesColorSerializer,
    ClothesSizeSerializer,
    ClothesImageSerializer,
    ClothesTypeModelSerializer
)

from rest_framework.exceptions import NotFound

class ClothesMainView(ListAPIView):
    queryset = ClothesModel.objects.prefetch_related('colors', 'sizes', 'catalogImages').all()
    serializer_class = ClothesModelSerializer

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
        
class ClothesTypeMainView(ListAPIView):
    queryset = TypesModel.objects.all()
    serializer_class = ClothesTypeModelSerializer

class ClothesModelDetailView(RetrieveAPIView):
    queryset = ClothesModel.objects.prefetch_related('colors', 'sizes', 'catalogImages').all()
    serializer_class = ClothesModelSerializer
    lookup_field = 'slug'

    def get_object(self):
        try:
            # Attempt to fetch the object by slug
            return self.queryset.get(slug=self.kwargs.get(self.lookup_field))
        except ClothesModel.DoesNotExist:
            # Raise a 404 error explicitly
            raise NotFound(detail="Clothes not found", code=404)