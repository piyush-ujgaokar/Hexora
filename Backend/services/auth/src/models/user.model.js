import mongoose from "mongoose"


const userSchema=new mongoose.Schema({
    firebaseUid:{
        type:String,
        required:[true,"Firebase Uid is required"],
        unique:[true,"Firebase Uid should be unique"],
        trim:true
    },
    name:{
        type:String,
        required:[true,"Name is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email Should be Unique"],
        trim:true,
        lowercase:true
    },
    avatar:{
        type:String,
        default:""
    },
    credits:{
        type:Number,
        default:100,
        min:0
    }
},{
    timestamps:true
})


const userModel=mongoose.model("user",userSchema)


export default userModel