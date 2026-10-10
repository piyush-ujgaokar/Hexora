import dotenv from "dotenv"
dotenv.config()
import app from "./src/app.js"


const port=process.env.PORT || 8000

app.listen(port,()=>{
    console.log(`Server is Running on port ${port}`);
    
})