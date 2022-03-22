import mongoose from "mongoose"
import PersonModel from "../models/personModel.js"
class PersonController
{
    static create=(req,res)=>
    {
        res.render("index")
    }
    static cc=async(req,res)=>
    {
       try {
           const result=new PersonModel(
               {
                 name:req.body.name,
                   email:req.body.email,
                   password:req.body.password
               }
           )
           const doc=await result.save();
           console.log(doc)
           res.redirect("/home")
       } catch (error) {
           console.log(error)
           
       }
    }
    
}
export default PersonController