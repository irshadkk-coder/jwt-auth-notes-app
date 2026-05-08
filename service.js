import express from "express"
import mongoose from "mongoose";
import dotenv from 'dotenv'
import noteroutes from "./routes/noteRoutes.js";
import  errormiddleware from './middleware.js/errormidleware.js'
import userRoutes from './routes/userRoutes.js'
import cookieParser from "cookie-parser";
import cors from "cors";



const app=express()

dotenv.config();

const PORT=process.env.PORT || 3000

const db_url=process.env.MONGO_URL
const frontend_url=process.env.FRONTEND_URL || "http://localhost:5173"



app.use(express.json())
app.use(cookieParser());

app.use(cors({
  origin: frontend_url,
  credentials: true,
}));

app.use('/notes',noteroutes)
app.use('/user',userRoutes)




app.use(errormiddleware)



mongoose.connect(db_url)
.then(()=>{
   console.log( "mongob is connected")
})
.catch((err)=>{
console.log("connection is error",err)
})


app.get('/',(req,res)=>{
    res.send("api notes creating with express and mongodb")
    
})

app.listen(PORT,()=>
console.log(`app is running at http://localhost:${PORT}`))
