import express from 'express'
import web from './routes/web.js'
import {join} from 'path'



const app=express()

const port=process.env.port || '3000'

//Load routes
app.use('/',web)

//load static files
// app.use(express.static(join(process.cwd(),'public')))
//virtual files
app.use('/static',express.static(join(process.cwd(),'public')))
console.log((join(process.cwd(),'public')))

app.listen(port,()=>
{
    console.log(`Server is listing on htttp://localhost:${port}`);
    
})