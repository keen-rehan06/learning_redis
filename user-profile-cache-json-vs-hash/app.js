import express from "express";
import mongoose from "mongoose";
import Redis from "ioredis";

const app = express();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use(express.json({}));
app.use(express.urlencoded({extended:true}));

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

app.post("/user/:id/json",async(req,res) => {
    const data = await redis.set(`user:${req.params.id}:json`,JSON.stringify(req.body));
    res.status(200).json({
      success: true,
      message: "User saved as JSON",
      data: req.body,
    });
});

app.get("/user/:id/json",async(req,res) => {
        const raw = await redis.get(`user:${req.params.id}:json`);
    console.log("Raw:", raw);

    res.status(200).json({
      success: true,
      user: raw ? JSON.parse(raw) : null,
    });
})

app.post("/user/:id/hash",async(req,res) => {
    await redis.hset(`user:${req.params.id}:hash`,req.body)
    res.json({savedAs:"hash"})
})

app.get("/user/:id/hash",async(req,res) => {
    const user = await redis.hgetall(`user:${req.params.id}:hash`);
    res.json({user})
})

app.listen(3000,() => {
    console.log(`App is running on port 3000.`);
});
