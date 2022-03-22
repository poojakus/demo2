import express from 'express'
import pkg from 'express-validator';
const {body,validationcheck} = pkg;
function loginPass(req,res,next)
{
    body('email').not().isEmpty().isEmail().withMessage("Please Enter valid email.."),
    body('password').not().isEmpty().trim().withMessage("Please do not empty password"),
    next()

}
   



export default loginPass