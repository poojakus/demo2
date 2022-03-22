import userModel from "../models/userModel.js"

class userController
{
    static getAllProfile=async(req,res)=>
    {
        try {
            const result=await userModel.find()
            res.send(result)
        } catch (error)
         {
            console.log(error)
        }
    }
    static getProfile=async(req,res)=>
    {
       try {
           const result=await userModel.findById(req.params.id)
           res.send(result)
           console.log(result)
           
           
       } catch (error) {
           console.log(error)
       }
    }
static create=async(req,res)=>
{
    try {
        
        const {name,email,password,phone,address,twitter}=(req.body)
        const result=new userModel({
            name:name,
            email:email,
            password:password,
            phone:phone,
            address:address,
            twitter:twitter

        })
        const doc=await result.save()
        res.send(doc)
        console.log(doc)
    } catch (error) {
        console.log(error)
        
    }
}

    static update=async(req,res)=>
    {
        try {
            const result=await userModel.findByIdAndUpdate(req.params.id,req.body)
            res.send(result)
            console.log(result)
            
        } catch (error) {
            console.log(error)
            
        }
    }
}

//export usercontroller
export default userController