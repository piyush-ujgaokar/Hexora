import dotenv from "dotenv"
dotenv.config()
import app from "./src/app.js"
import { connectToDb } from "./src/config/db.js";
import http from "http"
import  {Server} from "socket.io"

const port=process.env.PORT || 4005


const server=http.createServer(app)
const io=new Server(server,{
  cors:{
    origin:true,
    credentials:true
  }
})


server.listen(port, async() => {
    await connectToDb()
  console.log(`Server is running on port ${port}`);
});