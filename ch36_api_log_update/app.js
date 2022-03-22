import express, { application } from 'express'

//express validator


//confing nd import dotenv file
import dotenv from 'dotenv'
dotenv.config()

//import connection file
import connectDB from './config/connectionDB.js'

//import model
import userModel from './models/userModel.js'

//import routes
import route from './routes/userRoutes.js'

//import swagger jsdoc and swagger-ui-express
import swaggerJSDoc from 'swagger-jsdoc'
import  SwaggerUI from 'swagger-ui-express'



const app=express()
//port
const port=process.env.PORT

//database connection
const DATAUR=process.env.DATAURL
connectDB(DATAUR)

//load json
app.use(express.json())

//load routes
app.use("/user",route)

//swagger defination
const options=
{
    swaggerDefinition:{
        openapi: '3.0.0',
        info:
        {
            title: 'User Get And Update API',
            version: '1.0.0',
        },

    },
    apis:['./routes/userRoutes.js'],
};
const swaggerSpecification=swaggerJSDoc(options);
app.use('/api-docs',SwaggerUI.serve,SwaggerUI.setup(swaggerSpecification));

//app testing
app.get("/",(req,res)=>
{
    res.send("Hello this is work successfully")
})


//port listening
app.listen(port,()=>
{
    console.log(`Server is listing on port http://localhost:${port}`)
})
