from django.shortcuts import render
from .serializer import (
    RegistrationSerializer,
    LoginSerializer,
    OTPSerializer
)
from .models import UserModel
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
import re
from django.utils import timezone

class UserRegistrationView(generics.CreateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            mobile_number = serializer.validated_data['mobile_number']
            
            user, created = UserModel.objects.get_or_create(mobile_number=mobile_number)
            
            user.generate_otp()
            
            return Response({
                'message': 'OTP sent successfully',
                'mobile_number': user.mobile_number
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        mobile_number = serializer.validated_data['mobile_number']
        otp = serializer.validated_data['otp']

        try:
            user = UserModel.objects.get(mobile_number=mobile_number)
        except UserModel.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.otp == otp and user.otp_expiration > timezone.now():
            token, created = Token.objects.get_or_create(user=user)
            user.is_verified = True
            user.save()
            return Response({
                'token': token.key,
                'mobile_number': user.mobile_number
            })
        return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)
    
class SendOTPView(APIView):
    def post(self, request):
        serializer = OTPSerializer(data=request.data)
        
        if serializer.is_valid():
            mobile_number = serializer.validated_data['mobile_number']
            
            if not re.match(r'^\+998\d{9}$', mobile_number):
                return Response({'error': 'Invalid mobile number format'}, status=status.HTTP_400_BAD_REQUEST)
            
            user, created = UserModel.objects.get_or_create(mobile_number=mobile_number)
            user.generate_otp()
            return Response({'message': 'OTP sent successfully'})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    def post(self, request):
        serializer = OTPSerializer(data=request.data)
        if serializer.is_valid():
            mobile_number = serializer.validated_data['mobile_number']
            otp = serializer.validated_data['otp']
            
            try:
                user = UserModel.objects.get(mobile_number=mobile_number)
            except UserModel.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
            if user.otp == otp and user.otp_expiration > timezone.now():
                user.is_verified = True
                user.save()
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'token': token.key,
                    'mobile_number': user.mobile_number
                })
            
            return Response({'error': 'Упс... Похоже, срок действия вашего OTP-кода истёк. Пожалуйста, запросите новый код, чтобы продолжить.'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)