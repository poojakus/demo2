import express from 'express'
import StudentController from '../controllers.js/studentControllers.js'

const route=express.Router()

route.get("/set",StudentController.set_cookie)
route.get("/get",StudentController.get_cookie)
route.get("/clr",StudentController.clr_cookie)

export default route