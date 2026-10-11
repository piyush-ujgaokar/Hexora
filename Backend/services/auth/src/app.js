import dotenv from "dotenv"
dotenv.config()
import express from "express"
import authRoutes from "./routes/auth.routes.js"

const app=express()
app.use(express.json())

app.use("/auth",authRoutes)

// app.get("/",(req,res)=>{
//     return res.status(200).json({
//         message:"Auth server is healthy"
//     })
// })

export default app






