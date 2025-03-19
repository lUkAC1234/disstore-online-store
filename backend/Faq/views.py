from rest_framework import generics
from .models import FaqModel
from .serializers import FaqModelSerializer

class FaqListAPIView(generics.ListAPIView):
    queryset = FaqModel.objects.all()
    serializer_class = FaqModelSerializer
