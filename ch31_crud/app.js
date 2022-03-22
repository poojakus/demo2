import expree from 'express'
import route from './router/web.js'
import connDb from './db/connection.js'
import mongoose from 'mongoose'
import LibModel from './schema/SchemaLibrary.js'


const app=expree()
const port=process.env.port || '3000'
const DATA_URL='mongodb://0.0.0.0:27017'
connDb(DATA_URL)


app.use("/",route)
app.use(expree.json())

app.get("/",(req,res)=>
{
    res.send("Hello this is work successfully")
})


app.listen(port,()=>
{
    console.log(`Server is listing on port http://localhost:${port}`)
})
