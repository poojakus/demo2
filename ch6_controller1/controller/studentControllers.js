const all=(req,res)=>
{
    const {id}=req.params;
    console.log(`id ${id}`)
    if(id==10)
    {
        res.send("This is id can't be deleted ")
    }
    else
    {
        res.send(`All teachers ${id}`)

    }
   
}
const dele=(req,res)=>
{
    res.send("Teacher is deleted")
}
export {all,dele}