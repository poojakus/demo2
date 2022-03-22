import express from 'express'
import web from './routes/web.js'
import {join } from 'path'
import middleware from './middlewares/logged-middleware.js'
import mid from './middlewares/logout-middleware.js'
import st from './routes/stud12.js'

const app=express()
const port=process.env.port || '3000'

//set ejs
app.set("view engine","ejs")

//set static files
app.use(express.static(join(process.cwd(),"public")))
//app.use(express.static(join(process.cwd(),"public")))

//use milldleware
//app.use(middleware)
//app.use('/about',middleware)//application based middle ware
//app.use(mid)

//load routes
app.use("/",web)

//load studen routes
app.use("/stud",st)



app.listen(port,()=>
{
    console.log(`Server is listing on http://localhost:${port}`)
})