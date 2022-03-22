import express from 'express'

const homeController=(req,res)=>
{
    res.send("Home Page")
}

export default homeController