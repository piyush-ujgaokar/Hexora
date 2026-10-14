import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import fileRoutes from "./routes/file.routes.js"

const app=express()
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.json())


app.use("/file",fileRoutes)


app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"File Server is healthy"
    })
})



export default app