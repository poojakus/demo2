import jwt from "jsonwebtoken";

//genrate token
class genToken
{
    static Token=(userID)=>
{
    let token;
      return  token=jwt.sign({UserID:userID},process.env.SECUTY_KEY,process.env.expiresIn)
    };
}



export default  genToken