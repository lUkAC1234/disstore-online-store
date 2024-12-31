from django.shortcuts import render, redirect, reverse
from django.urls import reverse_lazy
from django.utils.translation import gettext as _
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, CreateAPIView
from django.views.generic import (
    TemplateView,
)
    
from rest_framework import status
from .models import ClothesModel, ColorModel
from .serializer import ClothesModelSerializer, ClothesImageSerializer, ColorSerializer
from rest_framework import viewsets

class index(ListCreateAPIView):
    serializer_class = ClothesModelSerializer
    queryset = ClothesModel.objects.all()

# ViewSet for handling Clothes data with Images
class ClothesModelViewSet(viewsets.ModelViewSet):
    queryset = ClothesModel.objects.all()
    serializer_class = ClothesImageSerializer

# ViewSet for handling Color data
class ColorModelViewSet(viewsets.ModelViewSet):
    queryset = ColorModel.objects.all()
    serializer_class = ColorSerializer