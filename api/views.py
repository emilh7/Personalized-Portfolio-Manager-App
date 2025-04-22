from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
#from .models import User
#from .serializers import UserSerializer

import json

import mysql.connector
from .config import config


#class UsersView(APIView):
#    def get(self, request):
#        items = User.objects.all()
#        serializer = UserSerializer(items, many=True)
#        return Response(serializer.data)

#    def post(self, request):
#        serializer = UserSerializer(data=request.data)
#        if serializer.is_valid():
#            serializer.save()
#            return Response(serializer.data, status=201)
#        return Response(serializer.errors, status=400)
    
    
#TODO: login, check admin and user login info

@api_view(['GET', 'POST'])
@renderer_classes([JSONRenderer])

def check_login(request):

    if request.method == 'POST':
        return Response({  # EDITED: return dict instead of raw string
            'isuser': False,
            'isadmin': False
        })

    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    print(request)

    print(request.query_params)
    print(request.query_params.items)
    username = request.query_params.get('username')
    password = request.query_params.get('password')

    try:
        username = int(username)
        password = int(password)
    except (ValueError, TypeError):
        return Response({  # EDITED: return dict on parse failure
            'isuser': False,
            'isadmin': False
        })


    cursor.execute("SELECT UserID, Pass FROM User")

    username_valid = False
    admin_valid = False

    for (UserID, Password) in cursor:
        if username == UserID and password == Password:
            username_valid = True

    cursor.execute("SELECT AdminID, Pass FROM Admin")

    for (AdminID, Password) in cursor:
        if username == AdminID and password == Password:
            admin_valid = True

    return Response({  # EDITED: directly return boolean values
        'isuser': username_valid,
        'isadmin': admin_valid
    })

#TODO: balance info
@api_view(['GET'])
@renderer_classes([JSONRenderer])

def get_account_balance(request):
    """Return account balance of user"""

    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    userid = 1 #TODO: temporary, frontend should send query param specifying userid

    query = "SELECT Balance FROM BankAccount WHERE UserID = " + userid
    cursor.execute(query)

    balance = cursor.fetchone()
    print(balance)

    return Response({
        'balance': str(balance)
    })

#TODO: asset holdings

#TODO: assets