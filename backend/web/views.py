from django.shortcuts import render, redirect, reverse
from django.urls import reverse_lazy
from django.utils.translation import gettext as _
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.generic import (
    TemplateView,
)
    
from rest_framework import status
from .models import ClothesModel
from .serializer import ClothesSerializer

class index(APIView):
    """
    API view to retrieve and add clothes.
    """

    def get(self, request, *args, **kwargs):
        # Retrieve all clothes
        clothes = ClothesModel.objects.all()
        serializer = ClothesSerializer(clothes, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        # Add a new clothing item
        serializer = ClothesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)