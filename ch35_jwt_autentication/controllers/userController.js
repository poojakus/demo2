import UserModel from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


class userController
{
    static userRagistration=async(req,res)=>
    {
        const {name,email,password,conf_password,tc}=req.body
        const user=await UserModel.findOne({email:email})
        if(user)
        {
            res.send({"status":"Failed","message":"Email already exists!"})
        }
        else{
            if(name && email && password && conf_password && tc)
            {
                if(password===conf_password)
                {
                    try {
                        const salt=await bcrypt.genSalt(10)
                        const hashPassword=await bcrypt.hash(password,salt)
                        const result=new UserModel(
                            {
                                name:name,
                                email:email,
                                password:hashPassword,
                                tc:tc
                            }
                        )
                        const doc=await result.save()
                       

                        //current user lene ke liye
                        const saved_user=await UserModel.findOne({email:email})
                        
                        //genrate JWT token
                        const token=jwt.sign({userID:saved_user},process.env.KEY,{expiresIn:'5d'})
                        
                        res.send({"status":"success","message":"Ragistration Succesfullys","token":token})
                        console.log(doc)
                        
                    } catch (error) 
                    {
                        console.log(error)
                        res.send({"status":"Failed","message":"Unable to ragister...."})
                        
                    }
                }
                else
                {
                    res.send({"status":"Failed","message":"Password and confrim password does not match..."})
                }

            }
            else
            {
                res.send({"status":"Failed","message":"All fields are requaired"})
            }
        }

    }
    static UserLogin=async(req,res)=>
    {
        const {email,password}=(req.body)
        if(email && password)
        {
            const user=await UserModel.findOne({email:email})
            if(user != null)
            {
                const isMatch=await bcrypt.compare(password,user.password)
                if((user.email===email) && isMatch)
                {
                     //genrate JWT token
                     const token=jwt.sign({userID:user._id},process.env.KEY,{expiresIn:'5d'})
                    res.send({"status":"success","message":"User Login Successfully....","token":token})

                }
                else
                {
                    res.send({"status":"Failed","Meassage":"Username And password is incorrect..."})
                }

            }
            else
            {
                res.send({"status":"failed","message":"User is not ragister...."})
            }
        }
        else
        {
            res.send({"status":"failed","meassage":"All fields are require....."})
        }
    }
    static changePassword=async(req,res)=>
    {
        const {password,conf_password}=(req.body)
        if( password && conf_password)
        {
            if(password !== conf_password)
            {
                res.send({"status":"Failed","meassage":"Password does't match..."})
            }
            else
            {
                const salt=await bcrypt.genSalt(10)
                const newhashPassword1=await bcrypt.hash(password,salt)
                //console.log(req.userID)
               await UserModel.findByIdAndUpdate(req.user._id,{ $set: { password : newhashPassword1}})
                res.send({"status":"Success","message":"Password changed successfully...."})
            }
        }
        else
        {
            res.send({"status":"Failed","meassage":"All fields are required...."})
        }
    }
    static getUserLogedIn=async(req,res)=>
    {
        res.send(req.user)
    }
    static sendResetPaswordEmail=async(req,res)=>
    {
        const {email}=req.body
        if(email)
        {
            const user=await UserModel.findOne({email:email})
            console.log(user)
           
            if(user)
            {
                const secret=user._id + process.env.KEY
                const token=jwt.sign({userID:user._id},secret,{expiresIn:'25m'})
                const link=`http://localhost/api/user/reset/${user._id}/${token}`
                console.log(link)
                res.send({"status":"success","meassage":"Password reset Email sent.... Pls check your Email.."})

            }
            else
            {
                res.send({"status":"Failed","meassage":"Email is Not ragister...."})
            }

        }
        else
        {
            res.send({"status":"Failed","meassage":"Please Enter Valid...."})
        }
    }
    static userPasswordReset=async(req,res)=>
    {
        const {password,conf_password}=req.body
        const { id ,token}=req.params
        const user=await UserModel.findById(id)
        const new_secret=user._id+process.env.KEY

        try {
            jwt.verify(token,new_secret)
            if(password && conf_password)
            {
                if(password===conf_password)
                {
                    const salt=await bcrypt.genSalt(10)
                    const newhashPassword12=await bcrypt.hash(password, salt)
                    const result=await UserModel.findByIdAndUpdate(user._id,{ $set: {password:newhashPassword12}})

                    res.send({"status":"Success","meassage":"Password Changed Successfully...."})
                }
                else
                {
                    res.send({"status":"Failed","meassage":"New Password & confirom Password does't match..."})
                }

            }
            else
            {
                res.send({"status":"Failed","meassage":"All fields are required...."})
            }
            
        } catch (error) {
            console.log(error)
            
        }
    }

}

export default userController