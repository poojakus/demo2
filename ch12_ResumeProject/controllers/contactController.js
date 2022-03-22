import express from 'express'

const contactController=(req,res)=>
{
    res.render("contact",{'name':'contact'})
}

export default contactController