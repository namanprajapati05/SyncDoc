const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");

const setupWebSocket = require("./src/websocket/websocket");

require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Port
const PORT = process.env.PORT || 8000;

// Routes
// Add your routes here later

// Create HTTP server
const server = http.createServer(app);

// Setup WebSocket
setupWebSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
