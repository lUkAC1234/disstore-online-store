from django.urls import path
from .views import (
    WishlistListView,
    WishlistDetailView
)

urlpatterns = [
   path('wishlist/', WishlistListView.as_view(), name='wishlist-list'),
    path('wishlist/<int:pk>/', WishlistDetailView.as_view(), name='wishlist-detail'),
]
