import express from 'express'
import route from './routes/web.js'

const app=express()
const port=process.env.port || '3003'


app.use("/",route)

app.listen(port,()=>
{
    console.log(`Server is listing on http://localhost:${port}`)
})