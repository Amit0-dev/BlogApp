import mongoose from "mongoose";

async function db() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected successfully");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
        // Optionally rethrow the error so the calling code can catch it
        throw err;
    }
}

export { db };
