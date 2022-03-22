import UserModel from "../models/userSchema.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class userController
{
    static userRagistraion =async(req,res)=>
    {
        //console.log("sss",req.body);
        const {name,email,password,password_confirmation,tc}=req.body
        const user=await UserModel.findOne({email:email})
        if(user)
        {
            res.send({"status":"faield","message":"Email already exists"})
        }
        else
        {
            if(name && email && password && password_confirmation && tc)
            {
                if(password === password_confirmation)
                {
                        try {
                            const salt= await bcrypt.genSalt(10)
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
                          

                            //json web token
                            const saved_user=await UserModel.findOne({email:email})
                            //genrating jwt Token
                            const token=jwt.sign({userId:saved_user._id},process.env.JWT_SEKRATE_KEY,{expiresIn:'5d'})
                            
                            res.send({"status":"Success","message":"data is successfully inseredx!..","token":token}) 
                            console.log(doc)

                        } catch (error) 
                        {
                          console.log(error)  
                          res.send({"status":"faield","message":"Unable to ragistration!.."}) 
                        }
                }
                else
                {
                    res.send({"status":"faield","message":"Password are not same!.."})
                }

            }
            else
            {
                res.send({"status":"faield","message":"All fields are required.."})
            }
           
        }
    }
    static userLogin=async(req,res)=>
    {
        const {email,password}=req.body
        if(email && password)
        {
            const user=await UserModel.findOne({email:email})
            if(user!=null)
            {
                const ismatch=await bcrypt.compare(password,user.password)
                if((user.email ===email) && ismatch)
                {
                    //jwt token
                    const token=jwt.sign({userId:user.email},process.env.JWT_SECRET_KEY_LOGIN,{expiresIn:'5d'})
                    res.send({"status":"Success","message":"User Login Sucessfully..","token":token})

                }
                else
                {
                    res.send({"status":"faield","message":"Invalid Email and Password.."})
                }

            }
            else{
                res.send({"status":"faield","message":"Email is invalid pls ragister again.."})
            }
        }
        else
        {
            res.send({"status":"faield","message":"All fields are required.."})

        }


    }
    static changePassword=async(req,res)=>
    {
        const {password,changePassword}=req.body
        if(password && password_confirmation)
        {

            if(password !== password_confirmation)
            {
                res.send({"status":"faield","message":"New password and confirm New password does't match"})
            }
            else
            {
                const salt=await bcrypt.genSalt(10)
                const newHashPassword=await bcrypt.hash(password,salt)
                
                
            }
        }
        else
        {
                res.send({"status":"failed","message":"All fields are require"})

        }


    }
}

export default userController
