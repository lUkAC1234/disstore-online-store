from django.shortcuts import render
from .serializer import (
    RegisterSerializer,
    LoginTokenObtainPairSerializer,
    OTPRequestSerializer, 
    OTPVerifySerializer,
    UpdateUserSerializer
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

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
        
class UpdatePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        password = request.data.get("password")
        if not password:
            return Response({"detail": "Password not provided."}, status=400)
        user = request.user
        user.set_password(password)
        user.save()
        return Response({"detail": "Password updated successfully."})

class OTPRequestView(APIView):
    """
    Request an OTP code for registration or login.
    """
    def post(self, request, *args, **kwargs):
        serializer = OTPRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "OTP отправлен на вашу почту."}, status=status.HTTP_200_OK)

class OTPVerifyView(APIView):
    """
    Verify the OTP code; on success, complete registration or login.
    """
    def post(self, request, *args, **kwargs):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token_data = serializer.save()
        return Response(token_data, status=status.HTTP_200_OK)
    
class UpdateUserView(UpdateAPIView):
    serializer_class = UpdateUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def patch(self, request, *args, **kwargs):
        response = super().patch(request, *args, **kwargs)
        return Response({'user': response.data}, status=status.HTTP_200_OK)