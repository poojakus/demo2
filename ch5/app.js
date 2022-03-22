//const express=require('express')
// old way to import
// const stu =require ('./routes/student.js')
// const tea =require ('./routes/teacher.js')
//new way to import

import stu  from './routes/student.js'
import ghgh from './routes/teacher.js'




import express from 'express'
const app=express()
//const router=express.Router()
const port=process.env.port || '3000'

//loads router module
app.use('/vidhyarthi',stu)
app.use('/sikh',ghgh)

app.listen(port,()=>
{
    console.log(`server listinng at http://localhost:${port}`)
})
