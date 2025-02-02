export class WebSocketService {
  public ws: WebSocket | null = null;
  private readonly url: string = "ws://localhost:8000/ws";

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        resolve();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        reject(error);
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.ws = null;
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);
        // We'll handle messages later
      };
    });
  }

  startProcesses(numProcesses: number = 50): void {
    if (!this.ws) {
      throw new Error("WebSocket is not connected");
    }

    this.ws.send(
      JSON.stringify({
        action: "start_processes",
        num_processes: numProcesses,
      })
    );
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Create and export a singleton instance
export const wsService = new WebSocketService();
