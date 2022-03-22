import LibModel from "../modelSchema/SchemaLibrary.js";

class LibController
{
    static getAllBook=async(req,res)=>
    {
        res.send("All books are getk")
    }

    static getBookById=async(req,res)=>
    {
        res.send("Book Get BY ID")
    }

    static createBook=(req,res)=>
    {
       
        // const re=new LibModel(req.body)
        // const doc=await re.save()
        res.send("hi this is ")


    }


    static DeleteBook=async(req,res)=>
    {
        res.send("Book is deleted")
    }

    static UpdateBookBYID=async(req,res)=>
    {
        res.send("Updated Book BY ID")
    }
}


export default LibController