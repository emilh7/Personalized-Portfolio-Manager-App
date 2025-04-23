import mysql.connector
from datetime import datetime
from .config import config

def register_user(email, password): # Default 20000 starting balance in bank accounts
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
    
        # Get next UserID
        cursor.execute("SELECT MAX(UserID) FROM User")
        max_user_id = cursor.fetchone()[0]
        user_id = (max_user_id) + 1

        # Get next AccountID
        cursor.execute("SELECT MAX(AccountID) FROM BankAccount")
        max_account_id = cursor.fetchone()[0]
        account_id = (max_account_id) + 1

        # Get next PortfolioID
        cursor.execute("SELECT MAX(PortfolioID) FROM Portfolio")
        max_portfolio_id = cursor.fetchone()[0]
        portfolio_id = (max_portfolio_id) + 1

        # Link PortfolioID to UserID
        cursor.execute("""
        INSERT INTO Portfolio (PortfolioID, Balance, UserID) 
        VALUES (%s, %s, %s)""", (portfolio_id, 0.00, user_id))  

        # Insert into User table
        cursor.execute("""
            INSERT INTO User (UserID, Email, Pass) 
            VALUES (%s, %s, %s)
        """, (user_id, email, password))

        # Insert into BankAccount table
        cursor.execute("""
            INSERT INTO BankAccount (AccountID, UserID, Balance) 
            VALUES (%s, %s, %s)
        """, (account_id, user_id, 20000)) # Default start with 20000 in bank account

        # Insert into Portfolio table
        cursor.execute("""
            INSERT INTO Portfolio (PortfolioID, Balance) 
            VALUES (%s, %s)
        """, (portfolio_id, 0.00))  # Start with zero invested assets

        conn.commit()
        print(f"Registered User: ID={user_id}, Email={email}, AccountID={account_id}, PortfolioID={portfolio_id}")

    except mysql.connector.Error as err:
        print(f"MySQL Error: {err}")
    finally:
        cursor.close()
        conn.close()

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
            print("3. Register User")
            print("4. Exit")

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
                email = input("Email: ")
                password = int(input("Password (numeric): "))
                register_user(email, password)

            elif choice == '4':
                print("Exiting...")
                break

            else:
                print("Invalid input. Please try again.")

    except KeyboardInterrupt:
        print("\nProgram interrupted. Exiting...")

if __name__ == "__main__":
    main()

