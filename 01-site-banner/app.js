import express from "express";
import mongoose from "mongoose";
import Redis from "ioredis";
import config from "dotenv";

config.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const BANNER_KEY = "site-banner";
app.post("/banner", async(req,res) => {
       console.log("Body:", req.body);
    await redis.set(BANNER_KEY,req.body.message || "welcome to our site");
    res.json({success: true})
})

app.get("/banner-get", async(req,res) => {
    const banner = await redis.get(BANNER_KEY);
    res.json({message: banner});
})

app.delete("/banner-del", async(req,res) => {
    await redis.del(BANNER_KEY);
    res.json({success: true})
})

app.get("/banner/exists", async(req,res) => {
    await redis.exists(BANNER_KEY) ? res.json({exists: true}) : res.json({exists: false});
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});