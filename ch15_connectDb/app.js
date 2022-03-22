import express from 'express'
import mongoose from 'mongoose'
import connectDB from './db/connect.js'

const app=express()
const port=process.env.port || '3000'


// app.get("/",(req,res) =>
// {
//     res.send("hEello pooja")
// })

//mongoose.connect("mongodb://pooja123:12345@0.0.0.0:27017/SchoolDb?authSource=SchoolDb").then(()=>
// mongoose.connect("mongodb://0.0.0.0:27017").then(()=>
// {
//     console.log('connected Successfullty')
// })

const DATABASE_URL=process.env.DATABASE_URL || "mongodb://0.0.0.0:27017"
connectDB(DATABASE_URL)

app.listen(port,()=>
{
    console.log(`Server is listing from http://localhost:${port}`)
})