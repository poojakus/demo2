import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-Parser'
//const bodyParser = require('body-parser');
dotenv.config()
//course policy
import cors from 'cors'
import connection from './config/connection.js'
//usermodel
import UserModel from './models/userSchema.js'
//import routes
import route from './routes/web.js'


const app=express()
const port=process.env.PORT

//database connection
const data_url=process.env.url
connection(data_url)

// app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.urlencoded({extended:true}))

//cors policy jb bhi hum forntend se connect karenge tab ye error ko handle karega
app.use(cors())

//load routes
app.use("/",route)

//app.use(express.json())it is use for get method


app.listen(port,()=>
{
    console.log(`Server is listing on port http://localhost:${port}`)
})
