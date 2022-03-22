import express from 'express'
import web  from './router/web.js'
import {join} from 'path'

const app=express()
const port=process.env.port || '3015'

//set ejs
app.set("view engine","ejs")

//load routes
app.use("/",web)

//set static files
app.use(express.static(join(process.cwd(),"public")))


app.listen(port,()=>
{
    console.log(`Server is listing on http://localhost:${port}`)
})