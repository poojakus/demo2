import express from 'express'
import {all,dele} from '../controller/studentControllers.js'
const route=express.Router()


//All teachers

route.get("/all-:id([0-9]{2})",all)
route.put("/create",(req,res)=>
{
    res.send("Trachers is created")
})
route.post("/post",(req,res)=>
{
    res.send("Post is created")

})
route.delete("/delete",dele)

export default route