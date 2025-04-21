import mysql.connector
import random
import time
from datetime import datetime

from config import config

def truncate(flt, sig):

    trunc = f"{flt:.{sig}f}"
    return (float(trunc))

def update(val):

    change = float(random.randint(1,25)) / 500
    change = truncate(change, 5)

    polarity = random.randint(0,1)

    if not polarity:
        change *= -1.0

    val *= (1 + change)
    val = truncate(val, 1)

    print(val)

    return val

try:
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    cursor.execute("SELECT AssetID, MarketValue FROM Assets")

    assets = []
    prices = []

    for (AssetID, MarketValue) in cursor: #get all assets and their market value into arrays
        assets.append(AssetID)
        print(f"{AssetID}, {MarketValue}")
        prices.append(MarketValue)

    print("Simulating price updates every minute. Press Ctrl + C to stop.")
    while True:

        i = 0
        for AssetID in assets: #change the price of every asset by however much percent

            #TODO: Bond price change is different, so make different case for bonds
            #TODO: this needs to update graphs

            base_price = float(prices[i])

            fluctuation = random.uniform(-0.50, 0.50) 
            current_price = base_price + fluctuation
            prices[i] = current_price

            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            cursor.execute("""
                INSERT INTO PerformanceChart (AssetID, MetricValue, Timestamp)
                VALUES (%s, %s, %s)
            """, (AssetID, round(current_price, 2), timestamp))
            conn.commit()

            print(f"[{timestamp}] Asset {AssetID}; Inserted price: ${round(current_price, 2)}")

            i += 1

        time.sleep(60)  #wait one minute

except KeyboardInterrupt:
    print("\nStopped manually.")
finally:
    cursor.close()
    conn.close()