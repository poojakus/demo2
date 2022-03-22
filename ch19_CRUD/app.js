import express from 'express'
import mongoose from 'mongoose'
import connectDb from './db/connectDb.js'
import './model/crudSchema.js'
import {join} from 'path'
import web from './routes/web.js'



const app=express()
const port=process.env.port || '3000'

//database
const DATABASE_URI=process.env.DATABASE_URI || "mongodb://0.0.0.0:27017"
connectDb(DATABASE_URI)


//use express urlencoded middleware
app.use(express.urlencoded({extended:false}))

//use static files
app.use(express.static(join(process.cwd(),"public")))

//use ejs template
app.set("view engine","ejs")

//load router
app.use("/",web)


app.listen(port,()=>
{
    console.log(`Server is listing on port http://localhost:${port}`)
})
