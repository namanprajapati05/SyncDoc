const mongoose = require("mongoose")

const connectDb = async()=>{
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not configured. Add it to backend/.env.");
    }

    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected successfully")
}


module.exports = connectDb;