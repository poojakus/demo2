import userModule from "../models/userModule.js";
import jwt from "jsonwebtoken";
import Service from "../service/responseFunction.js";
import localization from "../service/localization.js";

const userAuthentication = async (req, res, next) => {
  try {
    //   const token=req.headers.token
    //  const token=req.headers
    // console.log()
    // const token = jwt.verify(req.headers.token,process.env.SECUTY_KEY);
    // console.log("token",token);
    // req.user = await userModule.findById(token.userID);

    const authorization = req.headers.accesstoken;
    console.log(authorization);
    //  if(authorization && authorization.startsWith('Bearer'))
    //  {

    const token = authorization;
    console.log("token", token);
    const { userID } = jwt.verify(token, process.env.SECUTY_KEY);
    // console.log(userID)
    req.user = await userModule.findById(userID);
    console.log("hello");
    // console.log(req.user)

    next();
  } catch (error) {
    console.log(error);
    res.json(Service.response(0, localization.invalidtoken, null));
  }
  //     if(!token)
  // {
  //     res.json(Service.response(0,localization.notoken,null))
  // }
};

export default userAuthentication;
