const WebSocket = require("ws");

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    // Send a message to the newly connected client
    ws.send(
      JSON.stringify({
        type: "CONNECTED",
        message: "Connected to SyncDoc WebSocket server"
      })
    );

    // Receive message from client
    ws.on("message", (message) => {
      const data = JSON.parse(message.toString());

      console.log("Received:", data);

      // Send response back to the client
      ws.send(
        JSON.stringify({
          type: "RESPONSE",
          message: "Message received"
        })
      );
    });

    // When client disconnects
    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });

    // Handle errors
    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  console.log("WebSocket server initialized");

  return wss;
}

module.exports = setupWebSocket;
