from rest_framework import generics, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.exceptions import PermissionDenied
from .models import WishlistModel, Cart, CartItem
from .serializer import WishlistSerializer, CartSerializer, CartItemSerializer
from django.shortcuts import get_object_or_404

class WishlistListView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return WishlistModel.objects.filter(user=self.request.user).select_related('product')

class WishlistDetailView(generics.DestroyAPIView):
    queryset = WishlistModel.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_object(self):
        obj = super().get_object()
        if obj.user != self.request.user:
            raise PermissionDenied("You don't have permission to delete this item")
        return obj

class CartView(generics.RetrieveAPIView):
    """
    Retrieve the current user's cart (creates it if it doesn't exist)
    with prefetching of items and related product data.
    """
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_object(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        cart = Cart.objects.prefetch_related('items__product').get(pk=cart.pk)
        return cart

class CartItemListCreateView(generics.ListCreateAPIView):
    """
    List all items in the user's cart and allow adding new items.
    """
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return CartItem.objects.filter(cart=cart).select_related('product')

    def perform_create(self, serializer):
        serializer.context['request'] = self.request
        serializer.save()

class CartItemUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update (e.g., change quantity), or delete a cart item.
    """
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    lookup_url_kwarg = 'item_id'

    def get_queryset(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return CartItem.objects.filter(cart=cart)

    def get_object(self):
        queryset = self.get_queryset()
        item_id = self.kwargs.get(self.lookup_url_kwarg)
        return get_object_or_404(queryset, id=item_id)