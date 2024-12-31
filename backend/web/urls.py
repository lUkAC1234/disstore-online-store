from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import index

app_name = "main"

# Create a router and register your viewsets with it

urlpatterns = [
    path('', index.as_view(), name="index"),  # Main page (index)
    # path('', ColorModelViewSet.as_view(), name="colors"),  # Main page (index)
]
