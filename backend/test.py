import mysql.connector

config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Jbjw2004',
    'database': 'InvestmentDB'
}

conn = mysql.connector.connect(**config)
cursor = conn.cursor()

userid = 1 #TODO: temporary, frontend should send query param specifying userid

query = "SELECT Balance FROM BankAccount WHERE UserID = " + str(userid)
cursor.execute(query)

balance = cursor.fetchone()[0]
print(balance)
print(str(balance))