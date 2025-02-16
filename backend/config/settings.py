from pathlib import Path
from django.urls import reverse_lazy
from django.templatetags.static import static
from dotenv import load_dotenv
import os
import datetime

DEBUG = True

ALLOWED_HOSTS = ["*"]

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-$x&!cxodt5vf4)d*#htykxm*_saw*w&!!aorhh@*7i$y@celji'

INSTALLED_APPS = [
    'unfold',
    'unfold.contrib.import_export',
    "unfold.contrib.forms",
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'ckeditor',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    "corsheaders",
    'django_filters',
    'import_export',
    
    'fontawesomefree',

    'web',
    'UserAuth',
    'Cart',
]

MIDDLEWARE = [
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

SESSION_ENGINE = 'django.contrib.sessions.backends.db'  
SESSION_COOKIE_SAMESITE = 'Lax'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny'
    ],

    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': datetime.timedelta(days=7),
    'REFRESH_TOKEN_LIFETIME': datetime.timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

FILE_CHARSET = "utf-8"
DEFAULT_CHARSET = "utf-8"

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

SESSION_ENGINE = 'django.contrib.sessions.backends.db'

SESSION_COOKIE_AGE = 8 * 24 * 60 * 60

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / "web/templates"
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

UNFOLD = {
    "SITE_TITLE": "DISSTORE.UZ",
    "SITE_HEADER": "DISSTORE.UZ",
    "SITE_URL": "/clothes/",
    "SHOW_HISTORY": True, 
    "SHOW_VIEW_ON_SITE": True,
    "COLORS": {
        "base": {
            "50": "249 250 251",
            "100": "243 244 246",
            "200": "229 231 235",
            "300": "209 213 219",
            "400": "156 163 175",
            "500": "107 114 128",
            "600": "75 85 99",
            "700": "55 65 81",
            "800": "31 41 55",
            "900": "17 24 39",
            "950": "3 7 18",
        },
        "primary": {
            "50": "255 255 255", 
            "100": "255 255 255", 
            "200": "255 255 255",
            "300": "255 255 255", 
            "400": "17 17 17",    
            "500": "17 17 17",   
            "600": "17 17 17",   
            "700": "17 17 17",   
            "800": "17 17 17",   
            "900": "17 17 17",    
        },
        "font": {
            "subtle-light": "var(--color-base-500)",  
            "subtle-dark": "var(--color-base-400)", 
            "default-light": "var(--color-base-600)", 
            "default-dark": "var(--color-base-300)", 
            "important-light": "var(--color-base-900)",  
            "important-dark": "var(--color-base-100)", 
        },
    },
    "STYLES": [
        lambda request: static("main/admin/__admin.css"),
    ],
    "BORDER_RADIUS": "0.5rem",
    "SIDEBAR": {
        "show_search": True,
        "navigation": [
            {
                "separator": True, 
                "collapsible": True,
                "title": "Главная навигация",
                "items": [
                    {
                        "title": "Панель управления",
                        "icon": "dashboard",
                        "link": reverse_lazy("admin:index"),
                    },
                ],
            },
        ],
    },
}

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'disstore',
        'USER': 'postgres',
        'PASSWORD': 'dimatop12',
        'HOST': 'localhost',
        'PORT': '5432'
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'ru'

# gettext = lambda s: s

# LANGUAGES = [
#     ('en', gettext('English')),
#     ('ru', gettext('Russian')),
# ]

# LOCALE_PATHS = [
#     BASE_DIR / "web" / "locale"
# ]

# MODELTRANSLATION_DEFAULT_LANGUAGE = 'ru'


TIME_ZONE = 'Asia/Tashkent'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'static/')

STATICFILES_DIRS = BASE_DIR / 'assets',

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

MEDIA_URL = '/media/'

CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'full',
        'height': 600,
        'width': '100%'
    },
}

MESSAGE_STORAGE = 'django.contrib.messages.storage.session.SessionStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'UserAuth.UserModel'

DATA_UPLOAD_MAX_MEMORY_SIZE = 20 * 1024 * 1024
DATA_UPLOAD_MAX_NUMBER_FIELDS = 2000
# LOGIN_URL = 'main:login'

load_dotenv()