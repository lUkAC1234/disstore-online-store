from django.urls import path
from .views import (
    ClothesMainView,
    ClothesModelCreateUpdateView,
    ClothesColorCreateUpdateView,
    ClothesSizeCreateUpdateView,
    ClothesImageCreateUpdateView,
    ClothesModelDetailView,
)

urlpatterns = [
    path('clothes/', ClothesMainView.as_view(), name="clothes_main"),
    path('clothes/manage/', ClothesModelCreateUpdateView.as_view(), name="clothes_manage"),
    path('colors/manage/', ClothesColorCreateUpdateView.as_view(), name="colors_manage"),
    path('sizes/manage/', ClothesSizeCreateUpdateView.as_view(), name="sizes_manage"),
    path('images/manage/', ClothesImageCreateUpdateView.as_view(), name="images_manage"),
    path('clothes/<int:id>/', ClothesModelDetailView.as_view(), name="clothes_detail"),  
]
