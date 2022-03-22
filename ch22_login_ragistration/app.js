import userModel from './models/Schemas.js'
import dotenv from 'dotenv'
dotenv.config()
import expree from 'express'
import mongoose from 'mongoose'
import connectDb from './db/connection.js'
import router from './routers/web.js'


const app=expree()
const port=process.env.port || '3000'

const DATA_UR=process.env.dataurl
connectDb(DATA_UR)

//set view engine
app.set("view engine","ejs")

//router 
app.use("/",router)

app.get("/",(req,res)=>
{
    res.send("Hello this is work successfully")
})


app.listen(port,()=>
{
    console.log(`Server is listing on port http://localhost:${port}`)
})

