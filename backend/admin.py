import mysql.connector

from config import config


def list_asset(type, name, start_value):
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    #TODO: must add asset to assets table and record it in lists table
    
    cursor.execute("SELECT MAX(AssetID) AS MaxAssetID FROM Assets")
    print(cursor)

    for (id) in cursor:
        print(id)

    return

def delist_asset(id):
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    #TODO: must remove asset from assets table (and unrecord it from lists table?)

    return

#TODO: Moderate activity relation

if __name__ == "__main__": 
    #this is proof of concept stuff
    try:
        while True:
            inp = input("1 - list asset, 2 - delist asset, 3 - moderate activity")

            if inp == '1':
                type = input("type: ")
                name = input("name: ")
                start_value = input("start value: ")

                list_asset(type, name, start_value)

            elif inp == '2':
                id = input("asset id: ")

                delist_asset(id)

            elif inp == '3':
                print("hi")

            else:
                print("not valid")
                
    except KeyboardInterrupt:
        print("\nStopping program")