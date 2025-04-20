import mysql.connector
import random
import time
from datetime import datetime

config = { #TODO: put this in a separate file it has passwords
    'host': 'localhost',
    'user': 'root',
    'password': 'PUT PASSWORD HERE',
    'database': 'InvestmentDB'
}

asset_id = 9001
base_price = 175.00

try:
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    print("Simulating price updates every minute. Press Ctrl + C to stop.")
    while True:
        fluctuation = random.uniform(-0.50, 0.50) #TODO: sim.py for this
        current_price = base_price + fluctuation
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        cursor.execute("""
            INSERT INTO PerformanceChart (AssetID, MetricValue, Timestamp)
            VALUES (%s, %s, %s)
        """, (asset_id, round(current_price, 2), timestamp))
        conn.commit()

        print(f"[{timestamp}] Inserted price: ${round(current_price, 2)}")
        time.sleep(60)  # Wait one minute

except KeyboardInterrupt:
    print("\nStopped manually.")
finally:
    cursor.close()
    conn.close()