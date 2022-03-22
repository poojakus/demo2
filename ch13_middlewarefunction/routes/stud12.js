import express from 'express'
import stud from '../studentController/studController.js'
import mid from '../middlewares/logged-middleware.js'
import env from '../studentController/envController.js'


const route=express.Router()


//router based middleware
route.use('env',mid)

route.get("/",stud)
route.get("/env",env)

export default route

