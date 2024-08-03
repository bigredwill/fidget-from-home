import asyncio
import json
import websockets
import sys
import serial
import time

# todo - set time out for retry to connect to server. This allows raspberry pi to startup and keep attempting
#  to connect to server

# Serial setup
# Replace 'COM3' with the appropriate port for your system
# For Linux, it might be something like '/dev/ttyUSB0'
ser = serial.Serial('/dev/tty.usbmodem11401', 9600, timeout=1)
time.sleep(2)  # Wait for the connection to establish

def send_speed(speed):
    if -10 <= speed <= 10:
        ser.write(f"{speed}\n".encode())
        print(f"Sent speed: {speed}")
    else:
        print("Speed out of range. Must be between -10 and 10.")

async def on_message(websocket, path):
    async for message in websocket:
        print(f"Received message: {message}")
        try:
            data = json.loads(message)  # Parse the JSON message
            speed = float(data['content'])  # Extract and convert the speed value to float
            if 0 <= speed <= 5:
                mapped_speed = (speed / 5) * 10  # Map the value from 0-5 to 0-10
                send_speed(mapped_speed)
            else:
                print("Speed out of range. Must be between 0 and 5.")
        except (ValueError, KeyError, json.JSONDecodeError):
            print("Received invalid speed value")

async def on_error(websocket, path, error):
    print(f"Error: {error}")

async def on_close(websocket, path, close_status_code, close_msg):
    print("Connection closed")

async def on_open(websocket, path):
    print("Connection opened")
    await websocket.send(json.dumps({
        'sender': 'python client',
        'content': 'hello from python'
    }))

async def connect_to_server(websocket_url):
    try:
        async with websockets.connect(websocket_url) as websocket:
            await on_open(websocket, None)
            await on_message(websocket, None)
    except Exception as e:
        await on_error(None, None, e)
    finally:
        await on_close(None, None, None, None)

if __name__ == "__main__":
    # Default WebSocket URL
    default_url = "ws://localhost:6001"
    
    # Get WebSocket URL from command line arguments or use default
    websocket_url = sys.argv[1] if len(sys.argv) > 1 else default_url
    print(f"Connecting to {websocket_url}")
    
    asyncio.run(connect_to_server(websocket_url))
    ser.close()  # Close the serial connection when done