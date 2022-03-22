import userModel from "../models/userModel.js";
import  jwt  from "jsonwebtoken";

const userAuthentication=async(req,res,next)=>
{
    // console.log(req.headers.token)
    // const { authorization }=req.headers
    // console.log("fffff",authorization)
    // let token

    // if(authorization && authorization.startsWith('Bearer'))
    // {
        try {
            
            // token=authorization.split(' ')[1]
            // console.log(token)
            //verify
            const token=jwt.verify(req.headers.token,process.env.KEY)
            console.log("token",token)
            req.user=await userModel.findById( token.userID )
            next()

        } catch (error) {
            res.send({"status":"Invalid Token....."})
        }

    // }
    // if(!token)
    // {
    //     res.send({"status":"Failed","Meassage":"Unauthrozied user! invalid token..."})
    // }
}

export default userAuthentication