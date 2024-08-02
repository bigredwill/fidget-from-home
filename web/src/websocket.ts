function throttle(func: Function, limit: number) {
  let lastFunc: number;
  let lastRan: number;
  return (...args: any[]) => {
      if (!lastRan) {
          func(...args);
          lastRan = Date.now();
      } else {
          clearTimeout(lastFunc);
          lastFunc = window.setTimeout(() => {
              if ((Date.now() - lastRan) >= limit) {
                  func(...args);
                  lastRan = Date.now();
              }
          }, limit - (Date.now() - lastRan));
      }
  };
}

export class WebSocketManager {
  private client: WebSocket;

  constructor() {
      const wsUrl = import.meta.env.DEV ? 'ws://localhost:6001' : `ws://${import.meta.env.VITE_SOCKET_URL}`;
      this.client = new WebSocket(wsUrl);

      this.client.onopen = () => {
          console.log('WebSocket connection established');
      };

      this.client.onmessage = (event: MessageEvent) => {
          const parsedMessage = JSON.parse(event.data);
          console.log(`${parsedMessage.sender} says: ${parsedMessage.content}`);
      };

      this.client.onclose = () => {
          console.log('WebSocket connection closed');
      };

      this.client.onerror = (error: Event) => {
          console.error('WebSocket error:', error);
      };

      this.sendMessage = throttle(this.sendMessage.bind(this), 1000);
  }

  sendMessage(sender: string, content: string) {
      const message = JSON.stringify({ sender, content });
      this.client.send(message);
  }

  close() {
      if (this.client) {
          this.client.close();
      }
  }
}