import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(userId, { token } = {}) {
    if (this.socket?.connected) {
      return this.socket;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL;

    if (!socketUrl) {
      console.error(
        "Socket URL is missing. Set VITE_SOCKET_URL in your .env file.",
      );
      return null;
    }

    this.socket = io(socketUrl, {
      auth: {
        token,
      },
      query: { userId },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      //
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    if (process.env.NODE_ENV === "development") {
      this.socket.onAny((event, ...args) => {
        // 
      });
    }

    return this.socket;
  }

  on(event, callback) {
    if (!this.socket) {
      console.error("Socket not connected");
      return;
    }

    this.socket.on(event, callback);

    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.socket) return;

    this.socket.off(event, callback);

    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (!this.socket) {
      console.error("Socket not connected");
      return;
    }
    this.socket.emit(event, data);
  }

  subscribeToUserNotifications(callback) {
    const event = "newNotification";
    this.on(event, callback);
  }

  unsubscribeFromUserNotifications(callback) {
    const event = "newNotification";
    this.off(event, callback);
  }

  disconnect() {
    if (this.socket) {
      this.listeners.clear();
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();
