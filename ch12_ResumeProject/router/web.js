import express from 'express'
import homeController from '../controllers/homeController.js'
import serviceController from '../controllers/serviceController.js'
import skillController from '../controllers/skillController.js'
import contactController from '../controllers/contactController.js'

const route=express.Router()

route.get("/",homeController)
route.get("/services",serviceController)
route.get("/skill",skillController)
route.get("/contact",contactController)


export default route
