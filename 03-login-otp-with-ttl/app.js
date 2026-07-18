import express from "express";
import mongoose from "mongoose";
import Redis from "ioredis";

const app = express();
app.use(express.json({}));
app.use(express.urlencoded({extended:true}));

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

function otpKey(phone){
    return `otp ${phone}`
}

app.post("/otp",async(req,res) => {
    const {phone} =  req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(otpKey(phone),otp,'EX',30);
    res.json({message:`otp sent ${otp}`})
})

app.post("/otp/verify",async(req,res)=> {
    const {phone,otp} = req.body;
    const savedOtp = await redis.get(otpKey(phone));
    if(!savedOtp) return res.status(400).send({message:"OTP expired or not found!",success:false});
    if(savedOtp !== otp) return res.status(400).send({message:"Invalid Otp"});
    await redis.del(otpKey(phone));
    res.json({message:"OTP Verified SuccessFully!",success:true});
});

app.get("/otp/:phone/ttl",async(req,res) => {
    const ttl = await redis.ttl(otpKey(req.params.phone));
    res.json({ttl});
})

app.listen(3000,() => {
    console.log('App is running on port 3000.');
});