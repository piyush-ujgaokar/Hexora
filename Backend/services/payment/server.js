import dotenv from "dotenv"
dotenv.config()
import app from "./src/app.js"
import { connectToDb } from "./src/config/db.js";

const port=process.env.PORT || 4006



app.listen(port, async() => {
    await connectToDb()
  console.log(`Server is running on port ${port}`);
});