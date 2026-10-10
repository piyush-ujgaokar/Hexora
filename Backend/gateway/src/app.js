import express from "express";


const app=express()

app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"Gateway Server is healthy"
    })
})

export default app