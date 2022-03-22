import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app=express()
const port=process.env.PORT


app.get("/",(req,res)=>
{
    res.send("THis is working!---")
})

// var arr=[12,"pooja",56,78,"pkaddhd"]
// arr.forEach(function(item,index,ar)
// {
//     console.log(item +"->"+index+"->"+ar)
// })

// const no=[65,44,12,4]
// const newArr=no.map(myFun)
// function myFun(num)
// {
//     return num*10
// }
// console.log(newArr)


// const no=[23,12,45,67,89]
// const newArrr=no.map(x=>x+13)
// console.log(newArrr)

// const no=[1,3,5,8,9]
// const newArr=no.map(Math.sqrt)
// console.log(newArr)

// const no=[12,21,34,43,45,54]
// const newArr=no.map(mul)

// function mul(jk)
// {
//     return jk*12
// }
// console.log(newArr)

// const name=["pooja","aarti","awdhesh","vishal"]
// const newArr=name.map(coll)
// function coll(na)
// {
//     return na+'we'
// }
// console.log(newArr)

// const person=[
//     {
//         fristname:"pooja",
//         lastname:"kushwaha"
//     },
//     {
//         fristname:"Aarti",
//          lastname:"jain"
//     },
//     {
//         fristname:"Awdhesh",
//         lastname:"sharma"
//     }
// ]
// const newArr=person.map(fullName)
// function fullName(item)
// {
//     return [item.fristname,item.lastname].join(" ")
// }
// console.log(newArr)

//filter
//---1.
// const words=['sparay','limit','elite','present','delighing','destruction','pooja','awdhesh']
// const result=words.filter(word=>word.length>6)
// console.log(result)

//----2.
// let filltered=[12,5,8,130].filter(isBigEnogh)
// function isBigEnogh(item)
// {
//     return item >=12
// }
// console.log(filltered)

//----3.
// let filltered=["pooja","joii"].filter(len)
// function len(item)
// {
//     return len.length >=5
// }
// console.log(filltered)

// app.listen(port,()=>
// {
//     console.log(`Server is listing on http://localhost:${port}`)
// })

