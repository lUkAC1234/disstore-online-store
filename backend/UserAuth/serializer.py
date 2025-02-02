from rest_framework import serializers
from .models import UserModel

class OTPSerializer(serializers.Serializer):
    mobile_number = serializers.CharField()
    otp = serializers.CharField(max_length=6, required=False)

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['mobile_number']

    def create(self, validated_data):
        return UserModel.objects.create_user(**validated_data)
    
class LoginSerializer(serializers.Serializer):
    mobile_number = serializers.CharField(required=True)
    otp = serializers.CharField(required=True, style={'input_type': 'password'})