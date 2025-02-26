from django.urls import path
from .views import (
    ClothesMainView,
    ClothesModelDetailView,
    ClothesTypeMainView,
    ClothesColorsMainView,
    ClothesSizesMainView,
    NewClothesView,
    PopularClothesView
)

urlpatterns = [
    path('', ClothesMainView.as_view(), name="clothes_main"),
    path('new/', NewClothesView.as_view(), name="new_clothes"),
    path('popular/', PopularClothesView.as_view(), name="popular_clothes"),
    path('types/', ClothesTypeMainView.as_view(), name="types_main"),
    path('colors/', ClothesColorsMainView.as_view(), name="colors_main"),
    path('sizes/', ClothesSizesMainView.as_view(), name="sizes_main"),
    path('<slug:slug>/', ClothesModelDetailView.as_view(), name="clothes_detail"),  
]
