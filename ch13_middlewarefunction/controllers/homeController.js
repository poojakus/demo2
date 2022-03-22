import express from 'express'

const homeController=(req,res)=>
{
    res.render('home')
}

export default homeController