import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'

var checkUserAuth=async(req,res,next)=>
{
    let token
    //get token from header
    const { authorization }=req.headers
    if(authorization &&  authorization.startsWith('Bearer'))
    {
        try 
        {
            token=authorization.split(' ')[1]
            // console.log("token:-",token)
            // console.log("Authorization",authorization)
            //verify  token 
            const {userID}=jwt.verify(token,process.env.KEY)
           // console.log(userID)
            //get user from token
            req.user=await UserModel.findById(userID).select('-password')
            next()
        } catch (error) 
        {
            res.status(401).send({"status":"Faiels","meassage":"Unable to Autheticate...."})
        }

    }

    if(!token)
    {
        res.status(401).send({"status":"Faiels","meassage":"Unauthrozied user ! No token"})
    }

    
}

export default checkUserAuth