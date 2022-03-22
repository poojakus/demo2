import express from 'express'
//dotenv confing nd import
import dotenv from 'dotenv'
dotenv.config()
//connection import
import ConnectDb from './db/connection.js'
//model
import LibModel from './LibSchema/LibSchema.js'
//route
import route from './routes/web.js'
import bodyParser from 'body-parser'
//swagger
import swaggerJSDoc from 'swagger-jsdoc'
import SwaggerUi from 'swagger-ui-express'





const app=express()
//port
const port=process.env.PORT

//database connection
const DATA_UR=process.env.DB_URL
ConnectDb(DATA_UR)


//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//route
app.use("/lib",route)


const options=
{
    swaggerDefinition:
    {
        openapi: '3.0.0',
        info:
        {
            title:'Express API For CRUD',
            version:'1.0.0',
        },

    },
    apis: ['app.js'],
};
const swaggerSpecf = swaggerJSDoc(options);
app.use('/api-docs',SwaggerUi.serve,SwaggerUi.setup(swaggerSpecf));

/**
 * @swagger
 * /lib/:
 *   get:
 *     summary: Get All data
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                 responseMessage:
 *                    type: string
 *                 responseData:
 *                   type: object
 *                   properties:
 *                      list:
 *                          type: array
 *                          items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 618b6b34abf094b8e31e4f27
 *     
 *       
 * 
 */

/**
 * @swagger
 * /lib/{categoryId}:
 *   get:
 *     summary: Get Data By Id
 *     parameters:
 *      - in: path
 *        name: categoryId
 *        required: true
 *        default: 62135da7f0101fbf40ad91ba 
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                 responseMessage:
 *                    type: string
 *                 responseData:
 *                   type: object
 *                   properties:
 *                      list:
 *                          type: array
 *                          items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 618b6b34abf094b8e31e4f27
 *     
 *       
 * 
 */

/**
 * @swagger
 * /lib/:
 *    post:
 *     summary: Create New Data
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bname:
 *                 type: string
 *               bauthor:
 *                 type: string
 *               bprice:
 *                 type: integer
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                 responseMessage:
 *                    type: string
 *                 responseData:
 *                   type: object
 *                   properties:
 *                      list:
 *                          type: array
 *                          items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 618b6b34abf094b8e31e4f27
 *     
 *       
 * 
 *    
 *    
 */

/**
 * @swagger
 * /lib/{categoryId}:
 *   delete:
 *     summary: Delete data By Id
 *     parameters:
 *      - in: path
 *        name: categoryId
 *        required: true
 *        default: 62135da7f0101fbf40ad91ba 
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                 responseMessage:
 *                    type: string
 *                 responseData:
 *                   type: object
 *                   properties:
 *                      list:
 *                          type: array
 *                          items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 618b6b34abf094b8e31e4f27
 *     
 *       
 * 
 */
/**
 * @swagger
 * /lib/{categoryId}:
 *   put:
 *     summary: Update data By id
 *     parameters:
 *      - in: path
 *        name: categoryId
 *        required: true
 *        default: 62135da7f0101fbf40ad91ba
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bname:
 *                 type: string
 *               bauthor:
 *                 type: string
 *               bprice:
 *                 type: integer
 *                  
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                 responseMessage:
 *                    type: string
 *                 responseData:
 *                   type: object
 *                   properties:
 *                      list:
 *                          type: array
 *                          items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 618b6b34abf094b8e31e4f27
 *     
 *       
 * 
 */


app.get("/",(req,res)=>
{
    res.send("Hello this is work successfully")
})

//server is listing
app.listen(port,()=>
{
    console.log(`Server is listing on port http://localhost:${port}`)
})