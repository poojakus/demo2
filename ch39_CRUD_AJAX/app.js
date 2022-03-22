import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import DBConnect from './db/connection.js'
import PersonModel from './models/personModel.js'
import router from './routes/web.js'
import bodyParser from 'body-parser'

const app=express()

const port=process.env.PORT
const DBURL=process.env.DBURL
DBConnect(DBURL)

app.set("view engine","ejs")
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/",router)
app.get("/",(req,res)=>
{
    res.send("<h1>Hello</h1> ")
})

app.listen(port,()=>
{
    console.log(`Server is Listning on http://localhost:${port}`)
})

