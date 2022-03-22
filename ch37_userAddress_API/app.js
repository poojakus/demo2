import express from "express";
//config nd inport dotenv
import dotenv from "dotenv";
dotenv.config();
//database connectio
import connectDB from "./db/connectDB.js";
//import modelsimport
import userModule from "./models/userModule.js";
import addressModel from "./models/addressModule.js";
//import routes
import userRoute from "./routes/userRoutes.js";
import addressRoute from "./routes/addressRoutes.js";
//swagger Api
import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUi from "swagger-ui-express";

import commonroute from './routes/commonRoute.js'
import {join} from 'path'
import AdminModel from "./models/adminModel.js";
import bodyParser from 'body-parser'
import session from "express-session";
import flash from 'connect-flash';


const app = express();

//set port
const port = process.env.PORT;

//database connection
const data_url = process.env.DBURL;
connectDB(data_url);


app.set("view engine","ejs")
app.use(express.static(join(process.cwd(),"public")))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(session(
  {
    secret:'secret',
    cookie:{maxAge:120000},
    resave:false,
    saveUninitialized:false
  }
))
app.use(flash())

//json
app.use(express.json());

//Swagger Implements
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "User Has Multiple Address",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"],
};
const swaggerSpecification = swaggerJSDoc(options);
app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(swaggerSpecification));

//load Routes
app.use("/user", userRoute);
app.use("/", addressRoute);


//app testing
app.use("/",commonroute)
app.get("/",(req,res)=>
{
  res.render('login')
})

//app listen
app.listen(port, () => {
  console.log(`Server is listning on http://localhost:${port}`);
});
