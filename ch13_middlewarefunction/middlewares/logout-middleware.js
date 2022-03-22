import express from 'express'

var LoginMiddleware=(req,res,next)=>
{
    console.log("Logout")
    next()
}

export default LoginMiddleware