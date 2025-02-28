from django.urls import path
from .views import (
    UserRegistrationView,
    UserLoginView,
    UpdatePasswordView,
    OTPRequestView,
    OTPVerifyView
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('update_password/', UpdatePasswordView.as_view(), name='update_password'),
    path('otp/request/', OTPRequestView.as_view(), name='otp_request'),
    path('otp/verify/', OTPVerifyView.as_view(), name='otp_verify'),
]
