import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import connDb from './db/connection.js'
import LibModel from './modelSchema/SchemaLibrary.js'
import web from './router/web.js'
// import bodyParser from 'body-parser'

const app=express()
const port=process.env.PORT

const DATA_UR=process.env.DATA_URL
connDb(DATA_UR)

app.use("/",web)
//use express urlencoded middleware
// app.use(express.urlencoded({extended:false}))
app.use(express.json({extends:true}))

// app.get("/",(req,res)=>
// {
//     res.send("Hello this is working")
// })

app.listen(port,()=>
{
    console.log(`Server is listing on http://localhost:${port}`)
})