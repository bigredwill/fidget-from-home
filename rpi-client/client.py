import asyncio
import websockets
import sys

async def on_message(websocket, path):
    async for message in websocket:
        print(f"Received message: {message}")

async def on_error(websocket, path, error):
    print(f"Error: {error}")

async def on_close(websocket, path, close_status_code, close_msg):
    print("Connection closed")

async def on_open(websocket, path):
    print("Connection opened")
    await websocket.send("Hello, Server")

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
    default_url = "ws://localhost:8080"
    
    # Get WebSocket URL from command line arguments or use default
    websocket_url = sys.argv[1] if len(sys.argv) > 1 else default_url
    print(f"Connecting to {websocket_url}")
    
    asyncio.run(connect_to_server(websocket_url))