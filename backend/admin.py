import mysql.connector

config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'PASSWORD',
    'database': 'InvestmentDB'
}

def list_asset(asset_id, asset_type, name, start_price):
    portfolio_id = 3001   # default master portfolio
    quantity = 1          # default starting quantity
    admin_id = int(input("Admin ID: "))  # prompt for admin ID

    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    try:
        # Insert into Assets table
        cursor.execute("""
            INSERT INTO Assets (AssetID, AssetType, AssetName, MarketValue, PortfolioID, Quantity)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (asset_id, asset_type, name, float(start_price), portfolio_id, quantity))

        # Insert into List table
        cursor.execute("""
            INSERT INTO List (AssetID, AdminID)
            VALUES (%s, %s)
        """, (asset_id, admin_id))

        conn.commit()
        print(f"✅ Asset '{name}' (ID: {asset_id}, Type: {asset_type}) listed successfully by Admin {admin_id}.")

    except mysql.connector.Error as err:
        print(f"MySQL Error: {err}")

    finally:
        cursor.close()
        conn.close()

def delist_asset(asset_id):
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    try:
        # Delete from List first (foreign key constraint)
        cursor.execute("DELETE FROM List WHERE AssetID = %s", (asset_id,))
        cursor.execute("DELETE FROM Assets WHERE AssetID = %s", (asset_id,))
        conn.commit()
        print(f"Asset {asset_id} delisted and removed.")
    except Exception as e:
        print(f"Error while delisting asset: {e}")
    finally:
        cursor.close()
        conn.close()

# TODO: Moderate activity relation

if __name__ == "__main__": 

        while True:
            inp = input("1 - list asset, 2 - delist asset, 3 - moderate activity\n> ")

            if inp == '1':
                asset_type = input("type: ")
                name = input("name: ")
                start_value = input("start value: ")

                # Get next available AssetID
                conn = mysql.connector.connect(**config)
                cursor = conn.cursor()
                cursor.execute("SELECT MAX(AssetID) FROM Assets")
                result = cursor.fetchone()
                asset_id = (result[0] or 9000) + 1
                cursor.close()
                conn.close()

                list_asset(asset_id, asset_type, name, start_value)

            elif inp == '2':
                asset_id = input("asset id: ")
                delist_asset(asset_id)

            elif inp == '3':
                print("Feature not implemented yet.")

            else:
                print("Exiting program.")
                break