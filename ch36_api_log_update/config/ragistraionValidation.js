import express from 'express'
import pkg from 'express-validator';
const {body,validationcheck} = pkg;
function userragi(req,res,next)
{
        body('name').trim().not().isEmpty().isLength({min:4}).
        withMessage("Please enter a valid  name,minimumm  4 charcter long"),
        body('email').not().isEmpty().isEmail().withMessage("Please Enter valid email.."),
        body('password').not().isEmpty().trim().withMessage("Please do not empty password"),
        body('conf_password').not().isEmpty().trim().withMessage("Please do not empty conf-password"),
        body('phone').trim().not().isEmpty().isNumeric().isLength({min:5}).withMessage("Please enter valid mobile no. only numbeer more than 5 digits")


}
   



export default userragi