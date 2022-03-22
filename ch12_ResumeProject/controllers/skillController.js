import express from 'express'

const skillController=(req,res)=>
{
    res.render("skill",{'name':'Skill'})
}

export default skillController