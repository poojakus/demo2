import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import Service from '../services/localization.js'
import local from '../services/local.js'
import { validationResult} from 'express-validator'

class userController
{
    static ragisterUser=async(req,res)=>
    {
        try {
            //validation
            const err=validationResult(req)
            if(!err.isEmpty())
            {
                return res.status(400).json({ err: err.array() });
            }


            //validation end

            const {name,email,password,conf_password,phone}=req.body
           const user=await userModel.findOne({email:email})
           if(user)
           {
            res.status(200).json(Service.response(0,local.emailalready,null))
           }
           else
           {
            if(name && email && password && conf_password && phone)
            {
                if(password === conf_password)
                {
                    const salt=await bcrypt.genSalt(10)
                    const hashPassword=await bcrypt.hash(password,salt)
                    const result=new userModel(
                        {
                            name:name,
                            email:email,
                            password:hashPassword,
                            phone:phone
                        }
                    )
                    const doc=await result.save()
                    console.log(doc)
                    res.status(200).json(Service.response(1,local.ragistrationSuccess,null))
                }
                else
                {
                    res.status(200).json(Service.response(0,local.passwordnotmatch,null))
                }
            }
            else
            {
            
                res.status(200).json(Service.response(0,local.failed,null))
            }
           }
            
        } catch (error) {
            console.log(error)
        }
    }
    static loginUser=async(req,res)=>
    {
        try {

            //validation
            const Loginerr=validationResult(req)
            if(!Loginerr.isEmpty())
            {
                return res.status(400).json({ Loginerr: Loginerr.array() });
            }


            //validation end
            
            const {email,password}=req.body
           if(email && password)
           {
            const user=await userModel.findOne({email:email})
            
            if(user!= null)
            {
                //genrate token
                const token= jwt.sign({userID:user._id},process.env.KEY,{expiresIn:'5d'})
                //password marching from normal to hashMatch
                const isMatch=await bcrypt.compare(password,user.password)
                if((user.email===email) && isMatch)
                {
                    res.status(200).json(Service.response(1,local.loginSucc,token))
                }
                else
                {
                    res.status(200).json(Service.response(0,local.emailndpassinvalid,null))
                }
            }
            else
            {
                res.status(200).json(Service.response(0,local.userisnotragister,null))
            }
           }
           else
           {
            res.status(200).json(Service.response(0,local.failed,null))

           }

            

        } catch (error) {
            console.log(error)
        }
        
    }
    static UpdateUser=async(req,res)=>
    {
        try {
            const re=req.user
            //console.log(re)
            const result=await userModel.findByIdAndUpdate(req.user.id,req.body)   
            res.status(200).json(Service.response(1,local.userUpdateSuccess,null))
            console.log(result)         
        } catch (error)
         {
             console.log(error)
            
        }
    }


}

export default userController