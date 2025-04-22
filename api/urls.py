from django.urls import path
from .views import check_login


urlpatterns = [
    path('check_login/', check_login, name='check_login')
]