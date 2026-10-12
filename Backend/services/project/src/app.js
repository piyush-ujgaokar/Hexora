import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import projectRoutes from "./routes/project.routes.js"

const app=express()
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.json())


app.use("/",projectRoutes)

app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"Project Server is healthy"
    })
})



export default app