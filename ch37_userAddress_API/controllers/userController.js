import userModule from "../models/userModule.js";
import bcrypt from "bcrypt";
import Service from "../service/responseFunction.js";
import errormassge from "../service/localization.js";
import { validationResult } from "express-validator";
import genToken from "../service/tokenGen.js";
import httpstatus from '../service/httpSatus.js'


class userController {
  static userRagistration = async (req, res) => {
    try {
      //validation

      const err = validationResult(req);
      if (!err.isEmpty()) {
        res.status(400).json({ err: err.array(0) });
      }
      //end validation
      const user = await userModule.findOne({ email: req.body.email });
      if (user) 
      {
        res.status(400).json(Service.response(0, errormassge.emailalready, null));
      }
        //hash password making
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        //data save
        const result = new userModule({
          name: req.body.name,
          email: req.body.email,
          password: hashPassword,
          phone: req.body.phone,
          gender: req.body.gender,
        });
        const doc = await result.save();
      const token=genToken.Token({userID:doc._id})
        res.status(200).json(Service.response(httpstatus.Successfully, errormassge.ragistrationSuccess, token));
    } catch (error) {
      console.log(error);
    }
  };

  static userLogin = async (req, res) => {
      //validation
      const err = validationResult(req);
      if (!err.isEmpty()) {
        res.status(400).json({ err: err.array(0) });
      }
      //end validation
      const user = await userModule.findOne({ email: req.body.email });
      if (!user) {
        res.status(200).json(Service.response(0, errormassge.userisnotragister, null));
      } else {
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (user.email === req.body.email && isMatch) {
          const token=genToken.Token({userID:user._id})
          res.status(200).json(Service.response(httpstatus.Successfully, errormassge.ragistrationSuccess, token));
        } else {
          res
            .status(200).json(Service.response(httpstatus.Failed, errormassge.emailndpassinvalid, null));
        }
      }
  };
}

export default userController;
