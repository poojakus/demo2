import express from 'express'
import mongoose  from 'mongoose'
import connectDB from './db/connectDB.js'
import deleteDocById from './model/schemaModel.js'
import deleteDocByOne from './model/schemaModel.js'
import deleteDocMany from './model/schemaModel.js'
const app=express()
const port=process.env.port || '3000'

const DATABASE_URI=process.env.DATABASE_URI || "mongodb://0.0.0.0:27017"
connectDB(DATABASE_URI)
// deleteDocById("621cb65035bd83d2ff63547b")
deleteDocByOne("627c8a800f0a1679e150660f")
deleteDocMany('nikita')


app.listen(port,()=>
{
    console.log(`Server is lisening on http://localhost:${port}`)
})