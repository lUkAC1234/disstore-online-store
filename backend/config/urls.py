from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.i18n import i18n_patterns

# handler404 = views.PageNotFound
# handler403 = views.ForbiddenPage

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/clothes/', include('web.urls')),
    path('api/auth/', include('UserAuth.urls')),
    path('api/orders/', include('Cart.urls')),
    path('api/faqs/', include('Faq.urls')),
    path('api/global/reviews', include('GlobalReviews.urls')),
]

urlpatterns += i18n_patterns(
    # Add your i18n patterns here
)

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) 
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
