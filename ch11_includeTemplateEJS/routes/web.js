import express from 'express'
import aboutController from '../controller/aboutController.js'
import contactController from '../controller/contactController.js'
import homeController from '../controller/homeController.js'

const routes=express.Router()

routes.get("/",homeController)
routes.get("/about",aboutController)
routes.get("/contact",contactController)


export default routes


