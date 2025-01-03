from django.urls import path
from .views import (
    ClothesMainView,
    ClothesModelCreateUpdateView,
    ClothesColorCreateUpdateView,
    ClothesSizeCreateUpdateView,
    ClothesImageCreateUpdateView,
    ClothesModelDetailView,
    ClothesTypeMainView
)

urlpatterns = [
    path('', ClothesMainView.as_view(), name="clothes_main"),
    path('manage/', ClothesModelCreateUpdateView.as_view(), name="clothes_manage"),
    path('colors/manage/', ClothesColorCreateUpdateView.as_view(), name="colors_manage"),
    path('sizes/manage/', ClothesSizeCreateUpdateView.as_view(), name="sizes_manage"),
    path('images/manage/', ClothesImageCreateUpdateView.as_view(), name="images_manage"),
    path('types/', ClothesTypeMainView.as_view(), name="types_main"),
    path('<slug:slug>/', ClothesModelDetailView.as_view(), name="clothes_detail"),  
]
