import express from 'express'
import userController from '../controllers/userController.js'

const route=express.Router()

//public routes
route.post("/ragister",userController.userRagistraion)
route.post("/login",userController.userLogin)
route.post("/changepassword",userController.changePasswordxx)


//private routes



//export
export default route
