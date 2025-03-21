from rest_framework import serializers
from .models import GlobalReviewsModel
from UserAuth.serializer import RegisterSerializer

class GlobalReviewsSerializer(serializers.ModelSerializer):
    user = RegisterSerializer(read_only=True)
    class Meta:
        model = GlobalReviewsModel
        fields = ['id', 'user', 'text', 'created_at', 'is_allowed']