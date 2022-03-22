//Routing
//const express= require('express')
import express, { application } from 'express'
const app=express()
const port=process.env.PORT || '3000'

//ROUTES
// app.get('/', function(req,res)
// {
//     res.send("pooja kushwaha")
// })


// app.get('/', (req,res)=>
// {
//     res.send("get method")
// })

// app.get('/sbkuch', (req,res)=>
// {
//     res.send("sbkuch yha hai")
// })

// app.all('/sbkuch', (req,res)=>
// {
//     res.send("sbkuch yha hai")
// })

//page not found
// app.get('*', (req,res)=>
// {
//     res.send("page not found!!!!")
// })

// app.all('/api/*', (req,res)=>
// {
//     res.send("Api is API")
// })


//STrings path
// app.get("/about",(req,res)=>
// {
//     res.send("About page")
// })
// app.get("/contact",(req,res)=>
// {
//     res.send("Contact page")
// })

//String pattern path
// app.get("/ab?cd",(req,res)=>
// {
//     res.send("This route path will match acd and abcd")
// })

//Regular Expression
// app.get(/be/,(req,res)=>
// {
//     res.send("This is a")
// })

//one call back
// app.get("/cdexa",(req,res)=>
// {
//     res.send("CD Example")
// })

//MORE THAn 1 callback
// app.get('/cdexam2',(req,res,next)=>
// {
//     console.log("Frist call back")
//     // ek bar me 1 hi response hit hoga
//     next()
// },(req,res)=>
// {
//     console.log("Second  call back")
//     res.send("This is last call back")
// })

//Array od callback
// const cb1=(req,res,next)=>{
//     console.log("Frist call back")
//     next()
// }
// const cb2=(req,res,next)=>{
//     console.log("Second call back")
//     next()
// }
// const cb3=(req,res)=>{
//     console.log("thrid call back")
//     res.send("This is last call back")
// }
// app.get("/array",[cb1,cb2,cb3])

//Combination of Independent function and Array of fucntion"
// const cb1=(req,res,next)=>{
//     console.log("Frist call back")
//     next()
// }
// const cb2=(req,res,next)=>{
//     console.log("Second call back")
//     next()
// }
// app.get('/exam12',[cb1,cb2],(req,res,next)=>
// {
//     console.log("THird callback")
//     next()
// },(req,res)=>
// {
//     console.log("Fourth callback")
//     res.send("Combination of Independent function and Array of fucntion")
// }
// )


//chained ROute callback
// app.route('/student')
// .get((req,res)=>
// {
//     res.send("All Student")
// })
// .post((req,res)=>
// {
//     res.send("Add new Student")
// })
// .put((req,res)=>
// {
//     res.send("Add new Student")
// })


app.route('/student')
.all((req,res,next)=>
{
    console.log("This is 1st call and then after jo method hoga wo call hoga ")
    next()
})
.get((req,res)=>
{
    console.log("2nd method")
    res.send("All Student")
})
.post((req,res)=>
{
    console.log("3nd method")
    res.send("Add new Student")
})
.put((req,res)=>
{
    console.log("4nd method")
    res.send("Add new Student")
})



app.listen(port,()=> {
    console.log(`server listinng at http://localhost:${port}`)

})


