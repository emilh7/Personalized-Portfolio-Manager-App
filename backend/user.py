import mysql.connector
from datetime import datetime

config = {
    'host': 'localhost',
    'user': 'root',
    'password': '904134002',
    'database': 'InvestmentDB'
}

def buy_asset(user_id, account_id, portfolio_id, asset_id, quantity):
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    try:
        # Get current asset price
        cursor.execute("SELECT MarketValue FROM Assets WHERE AssetID = %s", (asset_id,))
        price_result = cursor.fetchone()
        if not price_result:
            print("Asset not found.")
            return
        market_value = price_result[0]
        total_cost = market_value * quantity

        # Check account balance
        cursor.execute("SELECT Balance FROM BankAccount WHERE AccountID = %s", (account_id,))
        balance_result = cursor.fetchone()
        if not balance_result or balance_result[0] < total_cost:
            print("Insufficient funds.")
            return

        # Deduct balance
        cursor.execute("UPDATE BankAccount SET Balance = Balance - %s WHERE AccountID = %s", (total_cost, account_id))

        # Update Portfolio balance
        cursor.execute("UPDATE Portfolio SET Balance = Balance + %s WHERE PortfolioID = %s", (total_cost, portfolio_id))

        # Generate new transaction ID
        cursor.execute("SELECT MAX(TransactionID) FROM Transaction")
        max_tid = cursor.fetchone()[0] or 8000
        new_tid = max_tid + 1

        # Insert transaction and buy record
        cursor.execute("INSERT INTO Transaction (TransactionID, Amount, Type, PortfolioID) VALUES (%s, %s, %s, %s)",
                       (new_tid, total_cost, 'Buy', portfolio_id))
        cursor.execute("INSERT INTO Buy (TransactionID, AccountID) VALUES (%s, %s)", (new_tid, account_id))

        # Update asset quantity
        cursor.execute("UPDATE Assets SET Quantity = Quantity + %s WHERE AssetID = %s", (quantity, asset_id))

        conn.commit()
        print(f"Bought {quantity} units of Asset {asset_id} for ${total_cost:.2f}.")

    except Exception as e:
        print(f"Error in buying asset: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def sell_asset(user_id, account_id, portfolio_id, asset_id, quantity):
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    try:
        # Get current asset quantity and price
        cursor.execute("SELECT Quantity, MarketValue FROM Assets WHERE AssetID = %s", (asset_id,))
        result = cursor.fetchone()
        if not result:
            print("Asset not found.")
            return

        current_qty, price = result
        if quantity > current_qty:
            print("Not enough quantity to sell.")
            return

        total_earnings = price * quantity

        # Add to account balance
        cursor.execute("UPDATE BankAccount SET Balance = Balance + %s WHERE AccountID = %s", (total_earnings, account_id))

        # Update Portfolio balance
        cursor.execute("UPDATE Portfolio SET Balance = Balance - %s WHERE PortfolioID = %s", (total_earnings, portfolio_id))

        # Generate new transaction ID
        cursor.execute("SELECT MAX(TransactionID) FROM Transaction")
        max_tid = cursor.fetchone()[0] or 8000
        new_tid = max_tid + 1

        # Insert transaction and sell record
        cursor.execute("INSERT INTO Transaction (TransactionID, Amount, Type, PortfolioID) VALUES (%s, %s, %s, %s)",
                       (new_tid, total_earnings, 'Sell', portfolio_id))
        cursor.execute("INSERT INTO Sell (TransactionID, AccountID) VALUES (%s, %s)", (new_tid, account_id))

        # Update asset quantity
        cursor.execute("UPDATE Assets SET Quantity = Quantity - %s WHERE AssetID = %s", (quantity, asset_id))

        conn.commit()
        print(f"Sold {quantity} units of Asset {asset_id} for ${total_earnings:.2f}.")

    except Exception as e:
        print(f"Error in selling asset: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def main():
    try:
        while True:
            print("\n=== User Asset Management ===")
            print("1. Buy Asset")
            print("2. Sell Asset")
            print("3. Exit")

            choice = input("Choose an option: ")

            if choice == '1':
                user_id = int(input("User ID: "))
                account_id = int(input("Bank Account ID: "))
                portfolio_id = int(input("Portfolio ID: "))
                asset_id = int(input("Asset ID to buy: "))
                quantity = int(input("Quantity to buy: "))
                buy_asset(user_id, account_id, portfolio_id, asset_id, quantity)

            elif choice == '2':
                user_id = int(input("User ID: "))
                account_id = int(input("Bank Account ID: "))
                portfolio_id = int(input("Portfolio ID: "))
                asset_id = int(input("Asset ID to sell: "))
                quantity = int(input("Quantity to sell: "))
                sell_asset(user_id, account_id, portfolio_id, asset_id, quantity)

            elif choice == '3':
                print("Exiting...")
                break

            else:
                print("Invalid input. Please try again.")

    except KeyboardInterrupt:
        print("\nProgram interrupted. Exiting...")

if __name__ == "__main__":
    main()

