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
@api_view(('GET',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def check_login(request):
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    username = 1
    password = 1234

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

    res = f'"isuser":"{username_valid}", "isadmin":"{admin_valid}"'

    res = '{' + res + '}'

    return Response(res)
#TODO: assets