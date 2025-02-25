import time
import board
import busio
import digitalio
import adafruit_rfm9x

# LoRa pins on Raspberry Pi
CS    = digitalio.DigitalInOut(board.CE1)    # Chip Select (GPIO 8)
RESET = digitalio.DigitalInOut(board.D25)   # Reset       (GPIO 25)

# SPI bus
spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)

# Initialize LoRa radio
rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, 433.0)

# Optionally set higher power, default is 13, max is 23
rfm9x.tx_power = 23

print("📡 LoRa Receiver Ready")

while True:
    print("📡 Waiting for LoRa packet...")
    packet = rfm9x.receive()

    if packet is not None:
        # Convert from bytes to string
        message = packet.decode("utf-8", errors="ignore").strip()
        print(f"📥 Received: {message}")
    else:
        print("❌ No packet received.")

    time.sleep(1)

