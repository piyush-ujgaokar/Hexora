const Plan={
    pro:{
        name:"Pro",
        amount:29900,
        credits:500
    },
    team:{
        name:"Team",
        amount:79900,
        credits:2000
    }
}



export const createOrderController=async(req,res)=>{
    try {

        const userId=req.headers["x-user-id"]
        if(!userId){
            return res.status(404).json({
                message:"UserId is not found"
            })
        }

        const {plan}=req.body
        const selectedPlan=Plan[plan]

        if(!selectedPlan){
            return res.status(400).json({
                message:"Plan is not found"
            })
        }


        
    } catch (error) {
        return res.status(500).json({
            message:`Error in CreateOrder controller :- ${error}`
        })
    }
}












