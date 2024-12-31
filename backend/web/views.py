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
from .serializer import ClothesSerializer, ColorSerializer

class index(ListCreateAPIView):
    serializer_class = ClothesSerializer
    queryset = ClothesModel.objects.all()

# # ViewSet for handling Color data
# class ColorModelViewSet(ListCreateAPIView):
#     serializer_class = ColorSerializer
#     queryset = ColorModel.objects.all()