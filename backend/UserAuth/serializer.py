from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import UserModel
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError

class LoginTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = UserModel.objects.filter(email=email).first()

        if user and user.check_password(password):
            refresh = self.get_token(user)

            return {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'access_expiration': refresh.access_token.payload['exp'],
                'refresh_expiration': refresh.payload['exp'],
                'user': {
                    'id': user.id,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'mobile_number': user.mobile_number
                }
            }
        raise serializers.ValidationError('Неверная почта или пароль')

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['id'] = user.id
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['email'] = user.email
        token['mobile_number'] = user.mobile_number
        return token

    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = UserModel
        fields = ('id', 'email', 'password', 'first_name', 'last_name', 'mobile_number')
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'mobile_number': {'required': False},
        }
        
    def validate_email(self, value):
        email = value.lower()
        if UserModel.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                "Пользователь с таким email уже существует. Пожалуйста, залогиньтесь."
            )
        return email

  
    def create(self, validated_data):
        try:
            return UserModel.objects.create_user(
                email=validated_data['email'],
                password=validated_data['password'],
                first_name=validated_data.get('first_name', ''),
                last_name=validated_data.get('last_name', ''),
                mobile_number=validated_data.get('mobile_number', '')
            )
        except IntegrityError:
            # In case the database throws an integrity error (duplicate email)
            raise ValidationError("Пользователь с таким email уже существует. Пожалуйста, залогиньтесь.")