import express from 'express'
import LibModel from "../LibSchema/LibSchema.js";

class LibController
{
    static getAll=async(req,res)=>
    {

       try 
       {
           const result=await LibModel.find()
           console.log(result)
           res.send(result)
       } catch (error) 
       {
           console.log(error)
       }
    }
    static creatNew=async(req,res)=>
    {
        try
         {
             const {bname,bauthor,bprice}=(req.body)
             const result=new LibModel(
                 {
                     bname:bname,
                     bauthor:bauthor,
                     bprice:bprice

                 }
             )
             const doc=await result.save()
             res.send(doc)
        
            
        } catch (error) 
        {
            console.log(error)
            
        }
    }
    static getById=async(req,res)=>
    {
        try {
            const result=await LibModel.findById(req.params.id)
            console.log(result)
          
            res.send(result)
            
        } catch (error) {
            console.log(error)
            
        }
    }
    static update=async(req,res)=>
    {
        try {
            const result=await LibModel.findByIdAndUpdate(req.params.id,req.body)
            res.send(result)
            console.log(result)
            
        } catch (error) {
            console.log(error)
            
        }
    }
    static delete=async(req,res)=>
    {
       try {
           const result=await LibModel.findByIdAndDelete(req.params.id)
           res.status(204).send(result)
       } catch (error) {
           console.log(error)
       }
    }
}


//export
export default LibController