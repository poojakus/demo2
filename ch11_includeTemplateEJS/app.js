import express from 'express'
import web from './routes/web.js'
import {join } from 'path'

const app=express()
const port=process.env.port || '3000'

//load routes
app.use("/",web)

//set ejs
app.set("view engine","ejs")

//set static 
app.use(express.static(join(process.cwd(),"public")))
//app.use(express.static(join(process.cwd(),'public')))


app.listen(port,()=>
{
    console.log(`Server is listing on http://localhost:${port}`)
})