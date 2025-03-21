from rest_framework import generics
from .models import GlobalReviewsModel
from .serializers import GlobalReviewsSerializer

class GlobalReviewsListAPIView(generics.ListAPIView):
    queryset = GlobalReviewsModel.objects.all()
    serializer_class = GlobalReviewsSerializer
