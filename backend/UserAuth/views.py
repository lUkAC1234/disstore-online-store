from django.shortcuts import render
from .serializer import (
    RegisterSerializer,
    LoginTokenObtainPairSerializer,
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

class UserLoginView(TokenObtainPairView):
    serializer_class = LoginTokenObtainPairSerializer
    
class UserRegistrationView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'access_expiration': refresh.access_token.payload['exp'],
            'refresh_expiration': refresh.payload['exp'],
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            }
        }, status=status.HTTP_201_CREATED)
