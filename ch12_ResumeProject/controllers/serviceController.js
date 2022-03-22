import express from 'express'

const serviceController=(req,res)=>
{
    res.render("services",{'name':'service'})
}

export default serviceController