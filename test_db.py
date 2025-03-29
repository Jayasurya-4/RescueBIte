import mysql.connector

try:
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="protectmyacnt",
        database="RescueBiteDB"
    )
    
    print("✅ Successfully connected to MySQL!")
    db.close()

except mysql.connector.Error as err:
    print(f"❌ Error: {err}")
