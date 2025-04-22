from django.urls import path
from .views import check_login, register, get_account_balance



urlpatterns = [
    path('check_login/', check_login, name='check_login'),
    path('register/',     register,    name='register'),
    path('get_account_balance/', get_account_balance, name='get_account_balance')
]