import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import paymentRoutes from "./routes/payment.routes.js"

const app=express()
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.json())


app.use("/payment",paymentRoutes)

app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"payment Server is healthy"
    })
})



export default app