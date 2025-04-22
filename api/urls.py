from django.urls import path
from .views import check_login, register


urlpatterns = [
    path('check_login/', check_login, name='check_login'),
    path('register/',     register,    name='register'),
]