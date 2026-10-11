import { cert, initializeApp } from "firebase-admin";
import serviceKey from "../serviceAccountKey.json" with {type:"json"} 


export const app=initializeApp({
    credential:cert(serviceKey)
})