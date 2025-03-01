from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import UserModel, OTPVerification
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.core.mail import send_mail
import random, string, datetime
from django.utils import timezone
from django.template.loader import render_to_string

class LoginTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        # Lowercase the email for consistency
        email = attrs.get('email').lower()
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
                    'mobile_number': user.mobile_number,
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
            raise ValidationError("Пользователь с таким email уже существует. Пожалуйста, залогиньтесь.")

class OTPRequestSerializer(serializers.Serializer):
    PURPOSE_CHOICES = (
        ('registration', 'Registration'),
        ('login', 'Login'),
    )
    email = serializers.EmailField()
    password = serializers.CharField(required=False, write_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    mobile_number = serializers.CharField(required=False, allow_blank=True)
    purpose = serializers.ChoiceField(choices=PURPOSE_CHOICES)

    def validate(self, attrs):
        purpose = attrs.get('purpose')
        # Lowercase the email to match how you store it
        email = attrs.get('email').lower()
        password = attrs.get('password')
        if purpose == 'registration':
            if UserModel.objects.filter(email=email).exists():
                raise serializers.ValidationError("Пользователь с таким email уже существует.")
        elif purpose == 'login':
            user = UserModel.objects.filter(email=email).first()
            if not user:
                raise serializers.ValidationError("Пользователь не найден.")
            if not password:
                raise serializers.ValidationError("Пароль обязателен для логина.")
            if not user.check_password(password):
                raise serializers.ValidationError("Неверный пароль.")
        attrs['email'] = email
        return attrs

    def create(self, validated_data):
        email = validated_data['email']
        purpose = validated_data['purpose']
        now = timezone.now()
        expires_at = now + datetime.timedelta(minutes=10)
        otp_code = ''.join(random.choices(string.digits, k=6))
        with transaction.atomic():
            otp_instance = OTPVerification.objects.filter(email=email, purpose=purpose).order_by('-created_at').first()
            if otp_instance and not otp_instance.is_expired():
                time_diff = now - otp_instance.last_sent
                if otp_instance.resend_count == 1 and time_diff < datetime.timedelta(minutes=1):
                    raise serializers.ValidationError("Подождите 1 минуту для повторной отправки кода.")
                elif otp_instance.resend_count == 2 and time_diff < datetime.timedelta(minutes=5):
                    raise serializers.ValidationError("Подождите 5 минут для повторной отправки кода.")
                elif otp_instance.resend_count >= 3 and time_diff < datetime.timedelta(minutes=30):
                    raise serializers.ValidationError("Подождите 30 минут для повторной отправки кода.")
                elif otp_instance.resend_count >= 4 and time_diff < datetime.timedelta(hours=1):
                    raise serializers.ValidationError("Подождите 1 час для повторной отправки кода.")

                otp_instance.code = otp_code
                otp_instance.expires_at = expires_at
                otp_instance.resend_count += 1
                otp_instance.last_sent = now
                if purpose == 'registration':
                    otp_instance.data = validated_data
                otp_instance.save(update_fields=['code', 'expires_at', 'resend_count', 'last_sent', 'data'])
            else:
                otp_instance = OTPVerification.objects.create(
                    email=email,
                    purpose=purpose,
                    code=otp_code,
                    expires_at=expires_at,
                    resend_count=0,
                    last_sent=now,
                    data=validated_data if purpose == 'registration' else None
                )
        subject = "Ваш код подтверждения для регистрации" if purpose == 'registration' else "Ваш код подтверждения для входа"
        try:
            html_message = render_to_string('emails/otp_email.html', {
                'otp_code': otp_code,
                'purpose': purpose,
            })
        except Exception:
            html_message = None
        plain_message = f"Ваш код подтверждения: {otp_code}. Он действителен 10 минут."
        try:
            send_mail(
                subject,
                plain_message,
                None,
                [email],
                fail_silently=False,
                html_message=html_message
            )
        except Exception:
            raise serializers.ValidationError("Ошибка отправки email.")
        return {'detail': 'Вам отправлен код подтверждения на вашу почту'}

class OTPVerifySerializer(serializers.Serializer):
    PURPOSE_CHOICES = (
        ('registration', 'Registration'),
        ('login', 'Login'),
    )
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)
    purpose = serializers.ChoiceField(choices=PURPOSE_CHOICES)

    def validate(self, attrs):
        email = attrs.get('email').lower()
        code = attrs.get('code')
        purpose = attrs.get('purpose')
        try:
            otp_instance = OTPVerification.objects.filter(email=email, purpose=purpose).latest('created_at')
        except OTPVerification.DoesNotExist:
            raise serializers.ValidationError("Код не найден. Запросите код повторно.")
        if otp_instance.is_expired():
            raise serializers.ValidationError("Код истек. Запросите новый код.")
        if otp_instance.code != code:
            raise serializers.ValidationError("Неверный код.")
        attrs['otp_instance'] = otp_instance
        return attrs

    def create(self, validated_data):
        otp_instance = validated_data.pop('otp_instance')
        email = validated_data.get('email')
        purpose = validated_data.get('purpose')
        otp_instance.delete()
        if purpose == 'registration':
            data = otp_instance.data or {}
            user = UserModel.objects.create_user(
                email=email,
                password=data.get('password'),
                first_name=data.get('first_name', ''),
                last_name=data.get('last_name', ''),
                mobile_number=data.get('mobile_number', '')
            )
        else:
            user = UserModel.objects.filter(email=email).first()
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'access_expiration': refresh.access_token.payload['exp'],
            'refresh_expiration': refresh.payload['exp'],
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'mobile_number': user.mobile_number,
            }
        }
