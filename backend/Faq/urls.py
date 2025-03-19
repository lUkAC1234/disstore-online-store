from django.urls import path
from .views import FaqListAPIView

urlpatterns = [
    path('', FaqListAPIView.as_view(), name='faq-list'),
]
