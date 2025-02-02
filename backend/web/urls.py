from django.urls import path
from .views import (
    ClothesMainView,
    ClothesModelDetailView,
    ClothesTypeMainView,
    ClothesColorsMainView,
    ClothesSizesMainView,
    WishlistListView,
    WishlistDetailView,
)

urlpatterns = [
    path('', ClothesMainView.as_view(), name="clothes_main"),
    path('types/', ClothesTypeMainView.as_view(), name="types_main"),
    path('colors/', ClothesColorsMainView.as_view(), name="colors_main"),
    path('sizes/', ClothesSizesMainView.as_view(), name="sizes_main"),
    path('<slug:slug>/', ClothesModelDetailView.as_view(), name="clothes_detail"),  
    path('wishlist/', WishlistListView.as_view(), name='wishlist-list'),
    path('wishlist/<int:product_id>/', WishlistDetailView.as_view(), name='wishlist-detail'),
]
