import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { env } from "../config/env.js";

let io: Server | null = null;

export function initializeSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });
  return io;
}

export function notifyUser(userId: string, event: string, payload: unknown) {
  if (!io) {
    return;
  }
  io.to(`user:${userId}`).emit(event, payload);
}

export function attachSocketHandlers() {
  if (!io) {
    return;
  }
  io.on("connection", (socket) => {
    socket.on("register-user-room", (userId: string) => {
      socket.join(`user:${userId}`);
    });
  });
}

