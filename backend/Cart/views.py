from rest_framework import status, generics, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.exceptions import PermissionDenied
from .models import WishlistModel, Cart, CartItem, Order, OrderItem
from .serializer import WishlistSerializer, CartSerializer, CartItemSerializer, CheckoutSerializer, OrderSerializer
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

class WishlistListView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return WishlistModel.objects.filter(user=self.request.user).select_related('product')

class WishlistDeleteView(generics.DestroyAPIView):
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
    
class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        serializer = CheckoutSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        shipping_details = serializer.validated_data['shipping_details']

        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response({"detail": "Cart not found."}, status=status.HTTP_400_BAD_REQUEST)

        if not cart.items.exists():
            return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(
            user=request.user,
            full_name=shipping_details['fullName'],
            address=shipping_details['address'],
            phone=shipping_details['phone'],
            email=shipping_details['email'],
        )

        cart_items = cart.items.all().select_related('product')
        for item in cart_items:
            unit_price = item.product.real_price  
            total_price = unit_price * item.quantity
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                selected_color=item.selected_color,
                selected_size=item.selected_size,
                selected_image=item.selected_image,
                unit_price=unit_price,
                total_price=total_price,
            )

        cart.items.all().delete()
        order_serializer = OrderSerializer(order)
        return Response(order_serializer.data, status=status.HTTP_201_CREATED)