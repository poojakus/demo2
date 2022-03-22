import express from 'express'

const homeController=(req,res)=>
{
    res.render('index',{'title':'home'})
}
export default homeController