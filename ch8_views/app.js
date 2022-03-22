import express from 'express'
import web from './routes/webapp.js'

const app=express()
const port=process.env.port || "3000"


//Routes load

app.use('/',web)

app.listen(port,()=>
{
    console.log("Server is listing on http://localhost:3000")
})