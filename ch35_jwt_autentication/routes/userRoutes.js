import express from 'express'
import userController from '../controllers/userController.js'
import checkUserAuth from '../middleware/auth-middleware.js'

const route=express.Router()
route.use("/changePassword",checkUserAuth)
route.use("/get-user-loged-in",checkUserAuth)

//router level middleware

//private routes

route.post("/ragister",userController.userRagistration)
route.post("/login",userController.UserLogin)
route.post("/sendResetPaswordEmail",userController.sendResetPaswordEmail)
route.post("/passwordReset/:id/:token",userController.userPasswordReset)

//protet routes
route.post("/changePassword",userController.changePassword)
route.get("/get-user-loged-in",userController.getUserLogedIn)


//export
export default route