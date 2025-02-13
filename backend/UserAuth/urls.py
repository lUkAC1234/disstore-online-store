from django.urls import path
from .views import (
    UserRegistrationView,
    UserLoginView,
    ping
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('ping/', ping, name='ping'),
]
