import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import  SwaggerUiOptions from 'swagger-ui-express'

const app=express()
const port=process.env.port

app.get("/",(req,res)=>
{
    res.send("<h1>Hello this is working</h1>")
})


app.listen(port,()=>
{
    console.log(`Server is listing on http://localhost:${port}`)
})