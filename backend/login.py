import mysql.connector

from config import config


def check_login(username, password):
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

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

    return username_valid, admin_valid

if __name__ == "__main__":
    print("1, 1234")
    print(check_login(1,1234))

    print("3, 1234")
    print(check_login(3,1234))

    print("6, 1234")
    print(check_login(6,1234))

    print("102, 4321")
    print(check_login(102, 4321))

    print("105, 4321")
    print(check_login(105, 4321))

    print("107, 4321")
    print(check_login(107, 4321))