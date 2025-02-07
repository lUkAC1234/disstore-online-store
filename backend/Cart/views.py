from rest_framework import status, generics, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import SessionAuthentication
from django.core.exceptions import PermissionDenied
from web.models import ClothesModel
from .models import WishlistModel
from .serializer import WishlistSerializer
from rest_framework.exceptions import ValidationError

class WishlistListView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get_queryset(self):
        return WishlistModel.objects.filter(user=self.request.user).select_related('product')

class WishlistDetailView(generics.DestroyAPIView):
    queryset = WishlistModel.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get_object(self):
        obj = super().get_object()
        if obj.user != self.request.user:
            raise PermissionDenied("You don't have permission to delete this item")
        return obj
