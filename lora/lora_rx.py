import time
import board
import busio
import digitalio
import adafruit_rfm9x
import sqlite3
import json
from websocket import create_connection

# 1) LoRa Radio Configuration
CS    = digitalio.DigitalInOut(board.CE1)  # NSS/CS
RESET = digitalio.DigitalInOut(board.D25)  # RST
spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)

rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, 433.0)  # 433 MHz
rfm9x.tx_power = 23

print("📡 LoRa Receiver Ready")

# 2) SQLite Database Setup
db_path = "lora_data.db"

def init_db():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sensor_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sensor_id TEXT,
            timestamp TEXT,
            luminosity REAL,
            temperature REAL,
            humidity REAL,
            soil_temperature REAL,
            soil_humidity REAL,
            pressure REAL,
            altitude REAL
        )
    ''')
    conn.commit()
    conn.close()

def save_to_db(sensor_id, timestamp, luminosity, temperature,
               humidity, soil_temperature, soil_humidity,
               pressure, altitude):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO sensor_data (
          sensor_id, timestamp, luminosity, temperature,
          humidity, soil_temperature, soil_humidity,
          pressure, altitude
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (sensor_id, timestamp, luminosity, temperature,
          humidity, soil_temperature, soil_humidity,
          pressure, altitude))
    conn.commit()
    conn.close()
    print("✅ Data saved to database!")

init_db()

# 3) Connect to Node.js WebSocket Server
#    Make sure your Node.js server is running on ws://localhost:3000 or similar.
WS_SERVER_URL = "ws://localhost:3000"
try:
    ws = create_connection(WS_SERVER_URL)
    print(f"✅ Connected to WebSocket server at {WS_SERVER_URL}")
except Exception as e:
    print(f"❌ Could not connect to WebSocket server: {e}")
    ws = None

while True:
    print("📡 Waiting for LoRa packet...")
    packet = rfm9x.receive()
    
    if packet:
        try:
            raw_data = packet.decode("utf-8", errors="ignore").strip()
            print(f"📥 Received raw data: {raw_data}")

            # Expecting 9 CSV fields now: 
            # [0]=sensor_id, [1]=timestamp, [2]=lum, [3]=temp, [4]=hum,
            # [5]=soil_temp, [6]=soil_hum, [7]=pressure, [8]=altitude
            data_parts = raw_data.split(",")
            if len(data_parts) == 9:
                sensor_id        = data_parts[0]
                timestamp        = data_parts[1]
                luminosity       = float(data_parts[2])
                temperature      = float(data_parts[3])
                humidity         = float(data_parts[4])
                soil_temperature = float(data_parts[5])
                soil_humidity    = float(data_parts[6])
                pressure         = float(data_parts[7])
                altitude         = float(data_parts[8])

                # Print data
                print("\n🔍 Parsed Sensor Data:")
                print(f"🤖 Sensor ID       : {sensor_id}")
                print(f"⏱ Timestamp       : {timestamp}")
                print(f"🌞 Luminosity      : {luminosity} lux")
                print(f"🌡 Temperature     : {temperature} °C")
                print(f"💧 Humidity        : {humidity} %")
                print(f"🌱 Soil Temperature: {soil_temperature} °C")
                print(f"💦 Soil Humidity   : {soil_humidity} %")
                print(f"🛰 Pressure        : {pressure} hPa")
                print(f"🏔 Altitude        : {altitude} m")
                print("-" * 40)

                # 4) Save to SQLite
                save_to_db(sensor_id, timestamp, luminosity, temperature,
                           humidity, soil_temperature, soil_humidity,
                           pressure, altitude)
                
                # 5) Send to WebSocket (Node.js)
                if ws:
                    message_json = {
                        "sensor_id": sensor_id,
                        "timestamp": timestamp,
                        "luminosity": luminosity,
                        "temperature": temperature,
                        "humidity": humidity,
                        "soil_temperature": soil_temperature,
                        "soil_humidity": soil_humidity,
                        "pressure": pressure,
                        "altitude": altitude
                    }
                    ws.send(json.dumps(message_json))
                    print("📡 Sent data to WebSocket server!")
            else:
                print("⚠️ Received incorrect number of data fields!")
        except Exception as e:
            print(f"❌ Error parsing LoRa data: {e}")

    time.sleep(0.01)

