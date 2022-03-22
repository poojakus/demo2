import express from 'express'

var LoggedMiddleware=(req,res,next)=>
{
    console.log("Loged in")
    next()
}

export default LoggedMiddleware