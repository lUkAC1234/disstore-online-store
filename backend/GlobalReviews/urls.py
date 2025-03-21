from django.urls import path
from .views import GlobalReviewsListAPIView

urlpatterns = [
    path('', GlobalReviewsListAPIView.as_view(), name='global-reviews-list'),
]
