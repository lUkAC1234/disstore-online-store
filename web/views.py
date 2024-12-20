from django.shortcuts import render, redirect, reverse
from django.urls import reverse_lazy
from django.utils.translation import gettext as _
from django.views.generic import (
    TemplateView,
)
    
class index(TemplateView):
    template_name = "pages/index.html"