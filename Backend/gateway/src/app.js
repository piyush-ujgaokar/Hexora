import dotenv from "dotenv"
dotenv.config()
import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import morgan from "morgan";
import proxy from "express-http-proxy";

const app=express()

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use(cookieParser())
app.use(morgan("dev"))

app.use("/api",proxy(process.env.AUTH_SERVICE))


app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"Gateway Server is healthy"
    })
})

export default app