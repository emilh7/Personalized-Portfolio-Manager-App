from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
#from .models import User
#from .serializers import UserSerializer
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt


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

@api_view(['POST'])
@renderer_classes([JSONRenderer])

def check_login(request):
    # 1. pull credentials from JSON body
    username_input = request.data.get('username')
    password_input = request.data.get('password')

    # 2. sanity check
    if not username_input or not password_input:
        return Response(
            {'isuser': False, 'isadmin': False},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 3. connect & look up user by string Username
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT UserID, Pass FROM User WHERE Username = %s",
        (username_input,)
    )
    user_row = cursor.fetchone()

    # 4. check password
    isuser = False
    user_id = None
    if user_row and str(user_row[1]) == password_input:
        isuser = True
        user_id = user_row[0]

    # 5. check admin table 
    cursor.execute("SELECT AdminID, Pass FROM Admin")
    admin_found = any(
        str(pw) == password_input and str(aid) == username_input
        for (aid, pw) in cursor
    )

    cursor.close()
    conn.close()

    # 6. return the flags 
    return Response({
        'isuser':  isuser,
        'isadmin': admin_found,
        'userID':  user_id
    })

@csrf_exempt  
@api_view(['POST'])
@renderer_classes([JSONRenderer])

def register(request):
    # 1. pull fields from JSON body (now including username string)
    username  = request.data.get('username')
    email     = request.data.get('email')
    password  = request.data.get('password')
    password2 = request.data.get('password2')

    # 2. basic validation
    if not all([username, email, password, password2]):
        return Response(
            {'error': 'All fields required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    if password != password2:
        return Response(
            {'error': 'Passwords must match'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()

        # figure out next numeric ID
        cursor.execute("SELECT MAX(UserID) FROM User")
        row = cursor.fetchone()
        next_id = (row[0] or 0) + 1

        # INSERT including the string Username
        cursor.execute(
            "INSERT INTO User (UserID, Username, Pass, Email) VALUES (%s, %s, %s, %s)",
            (next_id, username, int(password), email)
        )
        conn.commit()

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    finally:
        cursor.close()
        conn.close()

    # 4. success! return both success and the numeric userID
    return Response(
        {'success': True, 'userID': next_id},
        status=status.HTTP_201_CREATED
    )

#TODO: assets