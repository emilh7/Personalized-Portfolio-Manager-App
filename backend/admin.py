import mysql.connector

from config import config

#TODO: cursor should not be made outside of a function
conn = mysql.connector.connect(**config)
cursor = conn.cursor()

def list_asset():
    #TODO: must add asset to assets table and record it in lists table
    return

def delist_asset():
    #TODO: must remove asset from assets table (and unrecord it from lists table?)
    return

#TODO: Moderate activity relation

if __name__ == "__main__": 
    #this is proof of concept stuff
    try:
        while True:
            inp = input("1 - list asset, 2 - delist asset, 3 - moderate activity")

            if inp == '1':
                list_asset()
            elif inp == '2':
                delist_asset()
            elif inp == '3':
                print("hi")
            else:
                print("not valid")
                
    except KeyboardInterrupt:
        print("\nStopping program")