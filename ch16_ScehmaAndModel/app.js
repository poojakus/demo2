import expree from 'express'
import Mongoose  from 'mongoose'
import connDb from './db/connection.js'
import './models/Student.js'
import createDoc from './models/Student.js'



const app=expree()
const port=process.env.port || '3000'

//database coonection
const DATABASE_URL=process.env.DATABASE_URL || 'mongodb://0.0.0.0:27017'
//call connection function
connDb(DATABASE_URL)
//create and save document
// createDoc()
createDoc('Awdhesh kushwaha',25,60000,["pooja","pooja","baby"],false,[{value:'this is awdhesh'}])


app.listen(port,()=>
{
    console.log(`Server is listing on port http://localhost:${port}`)
})
