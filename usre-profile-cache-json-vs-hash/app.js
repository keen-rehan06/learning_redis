import express from "express";
import mongoose from "mongoose";
import Redis from "ioredis";

const app = express();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use(express.json({}));
app.use(express.urlencoded({extended:true}));

app.post("/user/:id/json",async(req,res) => {
    await redis.set(`user:${req.params.id}:json`,JSON.stringify(req.body));
})