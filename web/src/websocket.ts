function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let lastFunc: number;
  let lastRan: number;
  return ((...args: any[]) => {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = window.setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  }) as T;
}

export class WebSocketManager {
  private client: WebSocket;

  constructor() {
    const wsUrl = import.meta.env.DEV
      ? "ws://localhost:6001"
      : `${import.meta.env.VITE_SOCKET_URL}`;
    this.client = new WebSocket(wsUrl);

    this.client.onopen = () => {
      console.log("WebSocket connection established");
    };

    this.client.onmessage = (event: MessageEvent) => {
      const parsedMessage = JSON.parse(event.data);
      console.log(`${parsedMessage.sender} says: ${parsedMessage.content}`);
    };

    this.client.onclose = () => {
      console.log("WebSocket connection closed");
    };

    this.client.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
    };

    this.sendMessage = throttle(this.sendMessage.bind(this), 1000);
  }

  /**
   *
   * @param sender
   * @param content
   * @returns
   */
  sendMessage(sender: string, content: string): boolean {
    const message = JSON.stringify({ sender, content });
    if (this.client.readyState === this.client.OPEN) {
      this.client.send(message);
      return true;
    } else {
      console.log(
        "Not sending message. Client State: ",
        this.client.readyState
      );
      return false;
    }
  }

  close() {
    if (this.client) {
      this.client.close();
    }
  }
}
