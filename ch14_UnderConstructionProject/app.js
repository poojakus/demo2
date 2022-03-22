import express from 'express'
import route  from './routes/web.js'
import {join } from 'path'
import midd from './middlewares/uc-middleware.js'


const app=express()
const port=process.env.port || '3000'

//use application based middleware
app.use(midd)

//load ejs
app.set("view engine","ejs")

//load route
app.use('/',route)



//load static files
app.use(express.static(join(process.cwd(),'public')))
//app.use(express.static(join(process.cwd(),"public")))

app.listen(port,()=>
{
    console.log(`Server is listing on http://localhost:${port}`)
})
