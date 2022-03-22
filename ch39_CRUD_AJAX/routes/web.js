import express from 'express'
import PersonController from '../controllers/personController.js'

const router=express.Router()

router.get("/person",PersonController.create)
router.post('/create',PersonController.cc)
router.get('/home',(req,res)=>
{
    res.render('home')
})

export default router