const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDb = require("./src/config/database");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Port
const PORT = process.env.PORT || 8000;

// Routes




// Start server

const startServer = async()=>{
    await connectDb();


    app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

}

startServer();
