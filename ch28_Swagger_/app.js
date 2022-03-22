import express from 'express'
import dotenv from 'dotenv'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
dotenv.config()


const app=express();



const options = {
  swaggerDefinition:
  {
    openapi: '3.0.0',
    info: {
      title: 'Express API for JSONPlaceholder',
      version: '1.0.0',
    },

  },
  
  // Paths to files containing OpenAPI definitions
  apis: ['app.js'],
};

const swaggerSpec = swaggerJsDoc(options);
//console.log(swaggerSpec)
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerSpec))
// console.log(swaggerDocs)


// app.get("/books",(req,res)=>
// {
//     res.send({"name":"pooja",
// "book":"jijj"})
// })

const port='20000'

app.listen(port,()=>
{
    console.log(`Server is listong on http://localhost:${port}`)
})