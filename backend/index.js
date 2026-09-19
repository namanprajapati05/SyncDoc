const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDb = require("./src/config/database");
require("dotenv").config();
const cookieParser = require("cookie-parser");

//router import
const userRouter = require("./src/routes/user")


const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Port
const PORT = process.env.PORT || 8000;

// Routes

app.use("/user" , userRouter )


// global error handler

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});



// Start server

const startServer = async()=>{
    await connectDb();


    app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

}

startServer();
