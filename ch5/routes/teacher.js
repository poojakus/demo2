import express from 'express'


const router=express.Router()

router.get("/all",(req,res)=>
{
    res.send("All Teacher")
})
router.put("/put",(req,res)=>
{
    res.send("Teacher updeted")
})
router.post("post",(req,res)=>
{
    res.send(" New Teacher clear")
})
router.delete("/delete",(req,res)=>
{
    res.send("New Teacher Delete")
})

 export default router