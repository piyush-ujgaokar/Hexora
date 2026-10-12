import mongoose from "mongoose";


const projectSchema=new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"Project Owner required"],
    },
    name:{
        type:String,
        required:[true,"Project Name Required"],
    },
    description:{
        type:String,
    },
    starred:{
        type:Boolean,
        default:false
    },
    lastOpenedAt:{
        type:Date,
        default:Date.now()
    }
},{
    timestamps:true
})


const projectModel=mongoose.model("project",projectSchema)


export default projectModel