import { createServer } from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { attachSocketHandlers, initializeSocket } from "./services/socket.js";

const server = createServer(app);
initializeSocket(server);
attachSocketHandlers();

server.listen(env.PORT, () => {
  console.log(`PlacementOS API listening on http://localhost:${env.PORT}`);
});

