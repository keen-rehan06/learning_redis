import express from "express"
import Redis from "ioredis"
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
configDotenv()
const app = express();

const redis = new Redis(process.env.REDIS || 'redis://localhost:6379');

app.get("/redis",async(req,res) =>{
    const reply = await redis.ping();
    res.json({redis:reply})
})

app.get("/mongo",async(req,res) =>{
    const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/chai_aur_redis';
    if(mongoose.connection.readyState === 0){
        await mongoose.connect(url)
    }
    res.json({mongo:"connected",database:mongoose.connection.name});
})

app.listen(3000,() =>{
    console.log("Server is running on port 3000")
});