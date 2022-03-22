import express from 'express'
import web from './routes/web.js'
import { join } from 'path'

const app=express()
const port =process.env.port || '3000'

//load 
app.use("/",web)

//setup the directory  where  template  files  are located
//app.set('views','./views')

app.use(express.static(join(process.cwd(),'public')))

//setup  the template  engine  to use
app.set('view engine','ejs')//ye batat hai ki hum konsa engine use kar rhe hai or
// ishe likhne k bad hume controller me index.ejs likjne ki jarurat nhi hai


app.listen(port,()=>
{
    console.log(`Server is listing on http://localhost:${port}`)
})

