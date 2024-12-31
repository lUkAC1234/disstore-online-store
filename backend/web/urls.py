from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import index, ClothesModelViewSet, ColorModelViewSet

app_name = "main"

# Create a router and register your viewsets with it
router = DefaultRouter()
router.register(r'catalog/images', ClothesModelViewSet, basename='catalog_images')
router.register(r'catalog/colors', ColorModelViewSet, basename='catalog_colors')

urlpatterns = [
    path('', index.as_view(), name="index"),  # Main page (index)
    path('api/', include(router.urls)),  # API paths for images and colors
]
