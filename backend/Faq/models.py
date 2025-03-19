from django.db import models
from django.utils.translation import gettext_lazy as _
from ckeditor.fields import RichTextField

class FaqModel(models.Model):
    question = models.CharField(max_length=255, verbose_name=_("Вопрос"))
    answer = RichTextField(verbose_name=_("Ответ"))

    def __str__(self):
        return self.question
    
    class Meta:
        verbose_name = _("Часто задаваемые вопросы")
        verbose_name_plural = _("Часто задаваемые вопросы")
