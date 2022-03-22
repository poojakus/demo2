import express from 'express'
import homeController from '../controllers/Admincontroller.js'


const route=express.Router()

route.get("/createUser",homeController.CreateUser)
route.post("/CreateUser",homeController.UserCreate)
route.post("/loginUser",homeController.AdminLogin)
route.get("/home",homeController.homePage)
route.get("/tables",homeController.tableController)
route.get("/mydata",homeController.ListUser)
route.get("/edit/:id",homeController.EditCon)
route.post("/update/:id",homeController.UpdateCon)
route.get("/delete/:id",homeController.DeleteCon)
// route.post("/ragister",homeController.adminragister)


export default route