const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const setupWebSocket = require("./src/websocket/websocket");

const connectDb = require("./src/config/database");
const cookieParser = require("cookie-parser");

//router import
const userRouter = require("./src/routes/user");
const documentRouter = require("./src/routes/document");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());

// Port
const PORT = process.env.PORT || 8080;

// Routes
// Add your routes here later

app.use("/user" , userRouter )
app.use("/document" , documentRouter);


// global error handler

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});


const startServer = async()=>{
  await connectDb();

  const server = http.createServer(app);
  setupWebSocket(server);
  server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });

}

startServer();
