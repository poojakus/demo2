import express from 'express'
import {join} from 'path'

const homeController= (req,res)=>
{
    res.render('index',{"name":"pooja"})
}

export default homeController