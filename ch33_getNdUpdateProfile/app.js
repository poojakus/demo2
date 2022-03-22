import express from 'express'
//dotenv file
import dotenv from 'dotenv'
dotenv.config()

//data connection
import ConnectDb from './db/connection.js'
//import module
import userModel from './models/userModel.js'

//import route
import route from './routes/web.js'
//body parser middle ware
import bodyParser from 'body-parser'
//swagger import
import swaggerJSDoc from 'swagger-jsdoc'
import SwaggerUi  from 'swagger-ui-express'



const app=express()
//port
const port=process.env.PORT

//database
const data_url=process.env.URL
ConnectDb(data_url)


//middleware
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//load rouote
app.use("/user",route)

//swagger api
const options={
    swaggerDefinition:
    {
        openapi: '3.0.0',
        info:
        {
            title: 'User Get And Update',
            version: '1.0.0',
        },

    },
    apis:['./routes/web.js'],
};

const swaggerSpecf=swaggerJSDoc(options);
app.use('/api-docs',SwaggerUi.serve,SwaggerUi.setup(swaggerSpecf));

//app testing 
app.get("/",(req,res)=>
{
    res.send("Hello this is working...")
})


//port listing
app.listen(port,()=>
{
    console.log(`Server is listing on http://localhost:${port}`)
})