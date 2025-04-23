from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
#from .models import User
#from .serializers import UserSerializer
from .user import buy_asset, sell_asset
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt


import json

import mysql.connector
from .config import config

    
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

@csrf_exempt
@api_view(['GET'])
@renderer_classes([JSONRenderer])
def get_account_balance(request):
    """Return account balance of user"""

    try:
        userid = int(request.query_params.get('userid'))
    except (TypeError, ValueError):
        return Response({'error': 'Invalid or missing userid'}, status=400)

    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    cursor.execute("SELECT Balance FROM BankAccount WHERE UserID = %s", (userid,))
    row = cursor.fetchone()

    cursor.close()
    conn.close()

    if not row:
        return Response({'error': 'User not found'}, status=404)

    # Extract the numeric balance value
    balance_value = float(row[0])  # convert Decimal to float

    return Response({'balance': balance_value})





@csrf_exempt
@api_view(['GET'])
@renderer_classes([JSONRenderer])
def get_holdings(request):
    """Return asset holdings of user"""

    userid = request.query_params.get('userid')
    try:
        userid = int(userid)
    except:
        return Response({
        'balance': '0.00'
    })

    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    cursor.execute("""SELECT AccountID
                FROM BankAccount
                WHERE UserID = %s""", ([userid]))

    accid = 0

    for c in cursor:
        accid = c[0]

    transid = 0
    cursor.execute("""SELECT Buy.TransactionID
                FROM Buy
                WHERE AccountID = %s""", ([accid]))
    for c in cursor:
        transid = c[0]

    cursor.execute("""SELECT Sell.TransactionID
                FROM Sell
                WHERE AccountID = %s""", ([accid]))
    for c in cursor:
        transid = c[0]

    cursor.execute("""SELECT po.balance 
                FROM Portfolio as po, Transaction as tr
                WHERE tr.TransactionID = %s
                and tr.PortfolioID = po.PortfolioID""", ([transid]))
    for c in cursor:
        port_balance = c[0]

    return Response({
        'balance': port_balance
    })

#TODO: get holdings of specific asset types

@csrf_exempt
@api_view(['POST'])
@renderer_classes([JSONRenderer])
def api_buy_asset(request):
    try:
        data = request.data
        user_id = int(data.get('user_id'))
        account_id = int(data.get('account_id'))
        portfolio_id = int(data.get('portfolio_id'))
        asset_id = int(data.get('asset_id'))
        quantity = int(data.get('quantity'))

        buy_asset(user_id, account_id, portfolio_id, asset_id, quantity)
        return Response({'success': True})

    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
@renderer_classes([JSONRenderer])
def api_sell_asset(request):
    try:
        data = request.data
        user_id = int(data.get('user_id'))
        account_id = int(data.get('account_id'))
        portfolio_id = int(data.get('portfolio_id'))
        asset_id = int(data.get('asset_id'))
        quantity = int(data.get('quantity'))

        sell_asset(user_id, account_id, portfolio_id, asset_id, quantity)
        return Response({'success': True})

    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

#TODO: