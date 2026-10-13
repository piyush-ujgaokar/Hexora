import mongoose from "mongoose";


const fileSchema=new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"Owner id is required"]
    },
    parentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"file",
        default:null
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"project",
        required:[true,"project Id is required"]
    },
    name:{
        type:String,
        required:[true,"File name Is required"],

    },
    type:{
        type:String,
        enum:["file","folder"],
        required:[true,"file type is required"]
    },
    extension:{
        type:String,
        default:""
    },
    language:{
        type:String,
        default:"plantext"
    },
    content:{
        type:String,
        default:""
    },
    size:{
        type:Number,
        default:0
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})

const fileModel=mongoose.model("file",fileSchema)


export default fileModel