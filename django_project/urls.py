# pong_project/urls.py

from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from game import views
from rest_framework.authtoken import views as auth_views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

router = DefaultRouter()
router.register(r'players', views.PlayerViewSet)
router.register(r'gamerecords', views.GameRecordViewSet)

schema_view = get_schema_view(
    openapi.Info(
        title="Pong Game API",
        default_version='v1',
        description="API documentation for Pong Game",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@pong.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),
    path('api/', include(router.urls)),
    path('api/auth/', include('rest_framework.urls')),
    path('api/token/', auth_views.obtain_auth_token),
    path('admin/', admin.site.urls),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/set_players/', views.set_players),  # 새로운 엔드포인트 추가
]
