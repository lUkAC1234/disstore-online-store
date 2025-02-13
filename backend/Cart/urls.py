from django.urls import path
from .views import (
    WishlistListView,
    WishlistDetailView,
    CartView, 
    CartItemListCreateView, 
    CartItemUpdateDestroyView
)

urlpatterns = [
    path('wishlist/', WishlistListView.as_view(), name='wishlist-list'),
    path('wishlist/<int:pk>/', WishlistDetailView.as_view(), name='wishlist-detail'),
    
    path('cart/', CartView.as_view(), name='cart-detail'),
    path('cart/items/', CartItemListCreateView.as_view(), name='cart-items'),
    path('cart/items/<int:item_id>/', CartItemUpdateDestroyView.as_view(), name='cart-item-detail'),
]
