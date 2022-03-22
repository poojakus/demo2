import express from 'express'

const contactController=(req,res)=>
{
    res.render('contact',{'title':'contact'},)
}
export default contactController