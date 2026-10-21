import {getAuth} from "firebase-admin/auth"
import { app } from "../config/firebase.js";
import userModel from "../models/user.model.js";
import crypto from "crypto"
import redis from "../../../../shared/redis/redis.js";


export const loginController=async(req,res)=>{
    try {
        const {token}=req.body
        const decoded=await getAuth(app).verifyIdToken(token)

        let user=await userModel.findOne({firebaseUid:decoded.uid})

        if(!user){
          user= await userModel.create({
            firebaseUid:decoded.uid,
            name:decoded.name,
            email:decoded.email,
            avatar:decoded.picture
           })
        }

        const sessionId=crypto.randomUUID()

        await redis.set(`user-session-${user._id}`,sessionId,"EX", 7*24*60*60)

        await redis.set(`session-${sessionId}`,JSON.stringify({
            name:user.name,
            _id:user._id,
            email:user.email,
            avatar:user.avatar,
            credits:user.credits
        }),"EX",7*24*60*60)


        res.cookie("session",sessionId,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })


        return res.status(200).json({
            message:"User Login Successfully",
            user:user
        })

    } catch (error) {
        return res.status(500).json({
            message:`error in Login controller ${error}`
        })
        
    }
}


export const logoutController=async(req,res)=>{
    try {
        const sessionId=req.cookies?.session
        await redis.del(`session-${sessionId}`)

        res.clearCookie("session")


        return res.status(200).json({
            message:"User LogOut Successfully"
        })


    } catch (error) {
        console.log(`error in LogOut Controller:-- ${error}`);
        
    }
}

export const deductCreditsController=async(req,res)=>{
    try {
        const {userId,amount}=req.body
        if(!userId || !Number.isFinite(Number(amount)) || Number(amount) <= 0){
            return res.status(404).json({
                message:"UserId and a valid credit amount are required"
            })
        }

       const user=await userModel.findOneAndUpdate({_id:userId,credits:{$gte:amount}},{
            $inc:{
                credits:-amount
            }
        },{
            returnDocument:"after"
        })

        if(!user){
            return res.status(400).json({
                message:"insufficent-Credits"
            })
        }

        const sessionId=await redis.get(`user-session-${userId}`)

        if (sessionId) {
          await redis.set(`session-${sessionId}`,JSON.stringify({
            name:user.name,
            _id:user._id,
            email:user.email,
            avatar:user.avatar,
            credits:user.credits
          }),"EX",7*24*60*60)
        }

        return res.status(200).json({
            credits:user.credits
        })



    } catch (error) {
        return res.status(500).json({
            message:`DeductCredits controller error:- ${error}`
        })
    }
}


export const addCreditsController=async(req,res)=>{
    try {
        const {userId,credits}=req.body
        if(!userId){
            return res.status(404).json({
                message:"UserId not Found"
            })
        }

      const user=await userModel.findById(userId)

        if(!user){
            return res.status(404).json({
                message:"User Not Found"
            })
        }

        user.credits=(user.credits||0)+Number(credits)
       await user.save()

        const sessionId=await redis.get(`user-session-${userId}`)

        await redis.set(`session-${sessionId}`,JSON.stringify({
            name:user.name,
            _id:user._id,
            email:user.email,
            avatar:user.avatar,
            credits:user.credits
        }),"EX",7*24*60*60)

        return res.status(200).json(user.credits)



    } catch (error) {
        return res.status(500).json({
            message:`addCredits controller error:- ${error}`
        })
    }
}