import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import aiRoutes from "../routes/ai.routes.js"

const app=express()
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.json())

app.use("/ai",aiRoutes)

app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"Ai Server is healthy"
    })
})



export default app