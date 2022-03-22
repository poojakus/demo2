//All Students Routes
import express from 'express'
const router=express.Router()

router.get("/all",(req,res)=>
{
    res.send("All student")
})
router.post("/create",(req,res)=>
{
    res.send("New Student Clear")
})
router.put("/update",(req,res)=>
{
    res.send("Student Updated")
})
router.delete("/delete",(req,res)=>
{
    res.send("Student delete")
})

//export
//old version
//module.exports=router
export default router

