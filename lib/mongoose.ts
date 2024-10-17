import mongoose from "mongoose";

let isConnected: boolean = false

export async function connectToDatabase() {
    mongoose.set("strictQuery", true)

    if (!process.env.MONGODB_URL) {
        return console.log("MISSING MONGODB_URL")
    }

    if (isConnected) {
        return
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "devflow"
        })
        isConnected = true
        console.log("MongoDb is connected")
    } catch (error) {
        console.log("MongoDb connection failed", error)
    }
}