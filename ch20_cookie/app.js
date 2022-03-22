import expree from 'express'
import cookieParser from 'cookie-parser'
import route from './routers/web.js'

const app=expree()
const port=process.env.port || '3002'


//use cookie parser
app.use(cookieParser())

//load route
app.use("/",route)

app.get("/",(req,res)=>
{
    res.send("Hello this is work successfully")
})


app.listen(port,()=>
{
    console.log(`Server is listing on port http://localhost:${port}`)
})