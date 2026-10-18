import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import http from "http"

const app=express()
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.json())

app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"Terminal Server is healthy"
    })
})



export default app