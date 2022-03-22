import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import connectDB from './config/connection.js'
import UserModel from './models/User.js'
import route from './routes/userRoutes.js'



const app=express()
const port=process.env.port || '3000'

//cors policy for fortend 
app.use(cors())

//database connection
const dataurl=process.env.DBURL
connectDB(dataurl)

//json 
app.use(express.json())


//load routes
app.use("/user",route)

app.get("/",(req,res)=>
{
    res.send("Hello this is work successfully")
})


app.listen(port,()=>
{
    console.log(`Server is listing on port http://localhost:${port}`)
})