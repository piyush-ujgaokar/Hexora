import mongoose from "mongoose";




const paymentSchema=new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"userId is required in payment schema"]
    },
    plan:{
        type:String,
        enum:["pro","team"],
        required:[true,"plan is required in payment schema"]
    },
    amount:{
        type:Number,
        required:true
    },
    credits:{
        type:Number,
        required:true
    },
    currency:{
        type:String,
        default:"INR"
    },
    razorpayOrderId:{
        type:String,
        required:true
    },
    razorpayPaymentId:{
        type:String,
        default:null
    },
    status:{
        type:String,
        enum:["paid","created","failed"],
        default:"created"
    }
},{
    timestamps:true
})


const paymentModel=mongoose.model("payment",paymentSchema)

export default paymentModel