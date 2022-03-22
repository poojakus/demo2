import expree from 'express'
import stu from './routes/student.js'
import te from './routes/teacher.js'


const app=expree()
const port=process.env.port || '3000'

//Load routes
app.use("/stud",stu)
app.use('/teacher',te)


app.listen(port,()=>
{
    console.log(`Server is listing on port http://localhost:${port}`)
})

