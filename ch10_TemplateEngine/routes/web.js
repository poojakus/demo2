import express from 'express'
import homeController from '../controllers/homeControllers.js'
import aboutController from '../controllers/aboutController.js'

const route=express.Router()

route.get("/",homeController)
route.get("/about",aboutController)

export default route