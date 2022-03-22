import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import connectDB from './db/connect.js'
import StudentSChema from './models/studentSchema.js'
import router from './routes/web.js'

const app=express()
const port=process.env.PORT
const db_url=process.env.db_u
connectDB(db_url)

//loafd routers
app.use("/student",router)

//json
app.use(express.json())


app.get("/",(req,res)=>
{
    res.send("Hello thisis poooja")
})


app.listen(port,()=>
{
    console.log(`Server is listing on http://localhost:${port}`)
})