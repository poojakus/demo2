import expree from 'express'
import mongoose from 'mongoose'
import Db_Connect from './dbconnection/connect.js'
import './model/SchemaModel.js'
import inserDoc from './model/SchemaModel.js'
//import scSchma from './model/SchemaModel.js'
import getall from './model/SchemaModel.js'
import getSpecificdata from './model/SchemaModel.js'
import getSingleData from './model/SchemaModel.js'
import getDocByField from './model/SchemaModel.js'
import getDocLogical from './model/SchemaModel.js'
import updateDocById from './model/SchemaModel.js'
import updateSingDocument from './model/SchemaModel.js'
import updateManyDocument from './model/SchemaModel.js'



const app=expree()
//mongodb://0.0.0.0:27017
const port=process.env.port || '3000'

const DATABASE_URL=process.env.DATABASE_URL || "mongodb://0.0.0.0:27017"
Db_Connect(DATABASE_URL)
//call module
//inserDoc()
//getall()
// getSpecificdata()
// getSingleData()
// getDocByField()
// getDocLogical()
// updateDocById("621c8a800f0a1679e1506611")
// updateSingDocument("627c8a800f0a1679e150660f")
updateManyDocument('math')


app.listen(port,()=>
{
    console.log(`Server is listing on port http://localhost:${port}`)
})
