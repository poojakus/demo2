import express from 'express'

const aboutController=(req,res)=>
{
    res.render('about',{'title':'about'})
}
export default aboutController