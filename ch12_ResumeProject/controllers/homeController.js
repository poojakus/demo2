import express from 'express'

const homeController=(req,res)=>
{
    res.render("home",{'name':'home'})
}

export default homeController