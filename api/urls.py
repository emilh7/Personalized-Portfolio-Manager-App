from django.urls import path
from .views import check_login, register, get_account_balance, api_buy_asset, api_sell_asset


urlpatterns = [
    path('check_login/', check_login, name='check_login'),
    path('register/',     register,    name='register'),
    path('get_account_balance/', get_account_balance, name='get_account_balance'),
    path('buy/', api_buy_asset, name='buy_asset'),    
    path('sell/', api_sell_asset, name='sell_asset'),
]