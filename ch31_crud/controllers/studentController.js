import LibModel from "../schema/SchemaLibrary.js"

class StudController
{
    static create=async(req,res)=>
    {
        try {
            const result=new LibModel(req.body)
            const doc=await result.save()
            res.send(doc)
           
            
        } catch (error) {
            console.log(error)
            
        }
        
    }
    static getall=(req,res)=>
    {
        res.send("Hello this is getalll")
    }
}

export default StudController