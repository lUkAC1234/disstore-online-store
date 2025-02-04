from django.shortcuts import render
from .models import (
    WishlistModel
)

from .serializer import (
    WishlistSerializer,
)
from rest_framework import status, generics, permissions

class WishlistListView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WishlistModel.objects.filter(user=self.request.user).select_related('product')

    def perform_create(self, serializer):
        product_id = self.request.data.get('product_id')
        if WishlistModel.objects.filter(user=self.request.user, product_id=product_id).exists():
            raise serializer.ValidationError("Продукт уже добавлен в избранное")
        serializer.save(user=self.request.user)
        
        
class WishlistDetailView(generics.DestroyAPIView):
    queryset = WishlistModel.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = super().get_object()
        if obj.user != self.request.user:
            raise PermissionDenied("You don't have permission to delete this item")
        return obj