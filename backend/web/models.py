from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from ckeditor.fields import RichTextField
import random, string, os, uuid, subprocess
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile
from UserAuth.models import UserModel
from django.core.exceptions import ValidationError
from tempfile import NamedTemporaryFile

TRANSLIT_DICT = {
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
    'Й': 'I', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
    'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch', 'Ъ': '', 'Ы': 'Y', 'Ь': '',
    'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya', 'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'i', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p',
    'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
}

def transliterate_russian(text):
    return ''.join(TRANSLIT_DICT.get(c, c) for c in text)

class ClothesModel(models.Model):
    title = models.CharField(_("Название"), max_length=100)
    slug = models.SlugField(max_length=500, unique=True, blank=True, db_index=True, verbose_name=_("Отоброжаемая ссылка"))
    short_description = models.TextField(max_length=100, verbose_name=_("Краткое описание"))
    colors = models.ManyToManyField(
        'ClothesColorModel', 
        verbose_name=_("Цвета"), 
        related_name='colors'
    )
    sizes = models.ManyToManyField(
        'ClothesSizeModel', 
        verbose_name=_("Размеры"), 
        related_name='sizes'
    )
    
    count = models.PositiveIntegerField(default=1, verbose_name=_('Количество'))
    discount = models.PositiveIntegerField(default=0, verbose_name=_('Скидка, %'))
    price = models.PositiveIntegerField(_("Цена"))
    real_price = models.PositiveBigIntegerField(default=0, verbose_name=_('Реальная цена'))
    types = models.ManyToManyField(
        "TypesModel", 
        verbose_name=_("Тип одежды"),
        related_name='types'
    )
    
    long_description = RichTextField(verbose_name=_("Полное описание"))
    created_at = models.DateTimeField(_("Дата создания"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Обновился в"), auto_now=True)
    
    
    popularity = models.PositiveIntegerField(default=0, verbose_name=_("Популярность"))
    
    @property
    def is_discount(self):
        return self.discount != 0
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = transliterate_russian(self.title)
            base_slug = slugify(base_slug)
            unique_slug = base_slug
            random_suffix = ''.join(random.choices(string.ascii_letters + string.digits, k=200))
            while ClothesModel.objects.filter(slug=unique_slug).exists():
                random_suffix = ''.join(random.choices(string.ascii_letters + string.digits, k=200))
                unique_slug = f"{base_slug}-{random_suffix}"

            self.slug = unique_slug

        super().save(*args, **kwargs)
            
    
    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _("Одежда")
        verbose_name_plural = _("Одежды")
        ordering = ('-popularity', '-id',)
        
# Clothes Reviews & FAQs models
class ClothesReviewModel(models.Model):
    product = models.ForeignKey(
        ClothesModel, 
        on_delete=models.CASCADE, 
        related_name='reviews', 
        verbose_name=_("Продукт")
    )
    user = models.ForeignKey(
        UserModel, 
        on_delete=models.CASCADE, 
        verbose_name=_("Пользователь")
    )
    text = models.TextField(_("Текст"))
    created_at = models.DateTimeField(_("Дата создания"), auto_now_add=True)
    is_allowed = models.BooleanField(_("Разрешено"), default=False)
    
    def __str__(self):
        return f"Отзыв для {self.product.title}"

    class Meta:
        verbose_name = _("Отзыв")
        verbose_name_plural = _("Отзывы")
        ordering = ('-id',)
    
class ClothesFAQModel(models.Model):
    product = models.ForeignKey(
        ClothesModel, 
        on_delete=models.CASCADE, 
        related_name='faqs', 
        verbose_name=_("Продукт")
    )
    question = models.TextField(_("Вопрос"))
    answer = RichTextField(_("Ответ"), blank=True, null=True)
    created_at = models.DateTimeField(_("Дата создания"), auto_now_add=True)
    
    def __str__(self):
        return f"Вопрос для {self.product.title}"

    class Meta:
        verbose_name = _("Вопрос")
        verbose_name_plural = _("Вопросы")
        ordering = ('-id',)
        
# Clothes Characteristics Models
class TypesModel(models.Model):
    title = models.CharField(_("Название"), max_length=100)
    image = models.ImageField(_("Изображение"), upload_to='clothes/types/%Y/%m/%d/')
    
    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _("Тип одежды")
        verbose_name_plural = _("Типы одежды")
        ordering = ('id',)
        
class ClothesColorModel(models.Model):
    name= models.CharField(_("Названия цвета"), max_length=100)
    color= models.CharField(_("Цвет"), max_length=100)
    
    def __str__(self):
        return self.color

    class Meta:
        verbose_name = _("Цвет")
        verbose_name_plural = _("Цвета")
        ordering = ('-id',)
        
class ClothesSizeModel(models.Model):
    size = models.CharField(_("Размер"), max_length=100)
    
    def __str__(self):
        return self.size

    class Meta:
        verbose_name = _("Размер")
        verbose_name_plural = _("Размеры")
        ordering = ('-id',)

class ClothesImageModel(models.Model):
    product = models.ForeignKey(
        'ClothesModel',
        on_delete=models.CASCADE,
        related_name='catalogImages',
        verbose_name=_("Продукт")
    )
    image = models.ImageField(_("Изображение"), upload_to='clothes/images/%Y/%m/%d/')
    thumbnail = models.ImageField(_("Миниатюра"), upload_to='clothes/images/thumbnails/%Y/%m/%d/', blank=True, null=True)

    def save(self, *args, **kwargs):
        self.image = self.convert_to_webp(self.image)

        if not self.thumbnail:
            self.thumbnail = self.make_thumbnail(self.image)

        super().save(*args, **kwargs)

    def convert_to_webp(self, image):
        img = Image.open(image)

        for quality in range(95, 0, -5):
            buffer = BytesIO()
            img.save(buffer, format='WEBP', quality=quality)
            size_in_kb = buffer.tell() / 1024
            if size_in_kb <= 80: 
                return ContentFile(buffer.getvalue(), name=f"{image.name.split('.')[0]}.webp")

        buffer = BytesIO()
        img.save(buffer, format='WEBP', quality=10)
        return ContentFile(buffer.getvalue(), name=f"{image.name.split('.')[0]}.webp")

    def make_thumbnail(self, image):
        img = Image.open(image)

        target_width = 50
        aspect_ratio = img.width / img.height
        target_height = int(target_width / aspect_ratio)
        img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)

        thumb_io = BytesIO()
        img.save(thumb_io, format='WEBP', quality=80)
        return ContentFile(thumb_io.getvalue(), name=f"thumb_{image.name.split('.')[0]}.webp")


    def __str__(self):
        return f"Рисунок для {self.product.title}"

    class Meta:
        verbose_name = _("Изображение")
        verbose_name_plural = _("Изображения")
        
# BANNERS

def validate_banner_file(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.webp', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.mp4', '.mov', '.avi']
    if ext.lower() not in valid_extensions:
        raise ValidationError(
            _("Unsupported file extension. Allowed types: webp, png, jpg, jpeg, svg, gif, mp4, mov, avi.")
        )
        
class Banner(models.Model):
    file = models.FileField(
        _("Файл"),
        upload_to='banners/%Y/%m/%d/',
        validators=[validate_banner_file]
    )
    thumbnail = models.FileField(
        _("Миниатюра"),
        upload_to='banners/thumbnails/%Y/%m/%d/',
        blank=True,
        null=True
    )
    types = models.ManyToManyField(
        TypesModel, 
        verbose_name=_("Тип одежды"),
        related_name='banner_types'
    )
    
    created_at = models.DateTimeField(_("Создан в"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Обновлен в"), auto_now=True)

    def save(self, *args, **kwargs):
        if self.file:
            ext = self.file.name.split('.')[-1].lower()
            if ext in ['jpg', 'jpeg', 'png']:
                self.file = self.convert_image_to_webp(self.file)
            elif ext == 'gif':
                self.file = self.optimize_gif(self.file)
            elif ext in ['mp4', 'mov', 'avi']:
                self.file = self.optimize_video(self.file)
            
            if not self.thumbnail:
                self.thumbnail = self.make_thumbnail(self.file)
        super().save(*args, **kwargs)

    def convert_image_to_webp(self, file):
        img = Image.open(file)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")
        for quality in range(95, 0, -5):
            buffer = BytesIO()
            img.save(buffer, format='WEBP', quality=quality)
            size_in_kb = buffer.tell() / 1024
            if size_in_kb <= 80:
                new_name = f"{os.path.splitext(file.name)[0]}.webp"
                return ContentFile(buffer.getvalue(), name=new_name)
        buffer = BytesIO()
        img.save(buffer, format='WEBP', quality=10)
        new_name = f"{os.path.splitext(file.name)[0]}.webp"
        return ContentFile(buffer.getvalue(), name=new_name)

    def optimize_gif(self, file):
        with NamedTemporaryFile(delete=False, suffix=f"_{file.name}") as temp_input_file:
            for chunk in file.chunks():
                temp_input_file.write(chunk)
            temp_input = temp_input_file.name

        with NamedTemporaryFile(delete=False, suffix="_optimized.webp") as temp_output_file:
            temp_output = temp_output_file.name

        command = [
            "ffmpeg",
            "-y",
            "-i", temp_input,
            "-lossless", "0",
            "-q:v", "50", 
            "-preset", "picture",
            "-loop", "0",
            temp_output
        ]
        subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        with open(temp_output, 'rb') as f:
            optimized_content = f.read()

        os.remove(temp_input)
        os.remove(temp_output)

        new_name = f"{os.path.splitext(file.name)[0]}_optimized.webp"
        return ContentFile(optimized_content, name=new_name)

    def optimize_video(self, file):
        with NamedTemporaryFile(delete=False, suffix=f"_{file.name}") as temp_input_file:
            for chunk in file.chunks():
                temp_input_file.write(chunk)
            temp_input = temp_input_file.name

        with NamedTemporaryFile(delete=False, suffix="_optimized.mp4") as temp_output_file:
            temp_output = temp_output_file.name

        command = [
            "ffmpeg",
            "-y",
            "-i", temp_input,
            "-vcodec", "libx264",
            "-preset", "veryslow",
            "-b:v", "150k",     
            "-acodec", "aac",
            "-b:a", "32k",      
            "-vf", "scale=-2:240",  
            "-fs", "200k",       
            temp_output
        ]
        subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        with open(temp_output, 'rb') as f:
            optimized_content = f.read()

        os.remove(temp_input)
        os.remove(temp_output)

        new_name = f"{os.path.splitext(file.name)[0]}_optimized.mp4"
        return ContentFile(optimized_content, name=new_name)

    def make_thumbnail(self, file):
        ext = file.name.split('.')[-1].lower()
        if ext in ['webp', 'jpg', 'jpeg', 'png', 'gif']:
            try:
                img = Image.open(file)
            except Exception:
                return None

            try:
                img.seek(0)
            except Exception:
                pass

            target_width = 50 
            aspect_ratio = img.width / img.height
            target_height = int(target_width / aspect_ratio)
            img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)

            thumb_io = BytesIO()
            img.save(thumb_io, format='WEBP', quality=80)
            new_name = f"thumb_{os.path.splitext(file.name)[0]}.webp"
            return ContentFile(thumb_io.getvalue(), name=new_name)
        elif ext in ['mp4', 'mov', 'avi']:
            with NamedTemporaryFile(delete=False, suffix=f"_{file.name}") as temp_input_file:
                for chunk in file.chunks():
                    temp_input_file.write(chunk)
                temp_input = temp_input_file.name

            with NamedTemporaryFile(delete=False, suffix="_thumb.webp") as temp_output_file:
                temp_output = temp_output_file.name

            command = [
                "ffmpeg",
                "-y",
                "-i", temp_input,
                "-ss", "00:00:01.000",
                "-vframes", "1",
                "-vf", "scale=50:-1", 
                temp_output
            ]
            subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

            with open(temp_output, 'rb') as f:
                thumb_content = f.read()

            os.remove(temp_input)
            os.remove(temp_output)

            new_name = f"thumb_{os.path.splitext(file.name)[0]}.webp"
            return ContentFile(thumb_content, name=new_name)
        return None

    def __str__(self):
        return f"Баннер {self.id} для {', '.join(self.types.values_list('title', flat=True))}"

    class Meta:
        verbose_name = _("Баннер")
        verbose_name_plural = _("Баннеры")
        ordering = ('-created_at',)