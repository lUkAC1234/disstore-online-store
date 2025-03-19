from rest_framework import serializers
from .models import FaqModel

class FaqModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = FaqModel
        fields = ['id', 'question', 'answer']
