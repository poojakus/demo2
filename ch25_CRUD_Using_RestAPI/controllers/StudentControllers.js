import StudentSChema from "../models/studentSchema.js"

class StudentControler
{
    static createDoc=async(req,res)=>
    {
        try {
            const result =new StudentControler(req.body)
            const dec=await result.save
            res.send(dec)
        } catch (error) {
            console.log(error)
        }
    }
    static getAllDoc=async(req,res)=>
    {
       
        try 
        {
            const result=await StudentSChema.find()
            console.log(result)
            res.send(result)
        } catch (error) 
        {
            console.log(error)
        }
       
    }
    static getSingleDocById=async(req,res)=>
    {
        // res.send(" get Single Doc By Id")
        
        try {
            const result=await StudentSChema.findById(req.params.id)
            res.send(result)
            console.log(result)
        } 
        catch (error)
         {
            console.log(error)
        }
    }
    static updateDocById=(req,res)=>
    {
        res.send("Upadet Doc By id")
    }
    static deleteDocBYID=(req,res)=>
    {
        res.send("Data is deleted by ID")
    }

}
export default StudentControler