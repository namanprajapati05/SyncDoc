const WebSocket = require("ws");

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    ws.send(
      JSON.stringify({
        type: "CONNECTED",
        message: "Connected to SyncDoc WebSocket"
      })
    );

    ws.on("message", (message) => {
      const data = JSON.parse(message.toString());

      console.log("Received:", data);

      ws.send(
        JSON.stringify({
          type: "RESPONSE",
          message: "Message received successfully"
        })
      );
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  console.log("WebSocket server initialized");

  return wss;
}

module.exports = setupWebSocket;
