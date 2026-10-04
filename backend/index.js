const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");

const setupWebSocket = require("./src/websocket/websocket");

const connectDb = require("./src/config/database");
require("dotenv").config();
const cookieParser = require("cookie-parser");

//router import
const userRouter = require("./src/routes/user");
const documentRouter = require("./src/routes/document");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Port
const PORT = process.env.PORT || 8000;

// Routes
// Add your routes here later

// Create HTTP server
const server = http.createServer(app);
app.use("/user" , userRouter )
app.use("/document" , documentRouter);


// global error handler

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});


// Setup WebSocket
setupWebSocket(server);


// Start server

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
// Start server

const startServer = async()=>{
    await connectDb();


    app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

}

startServer();
