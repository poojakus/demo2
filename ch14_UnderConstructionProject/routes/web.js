import express from 'express'
import indexController from '../controllers/indexController.js'
import aboutController from '../controllers/aboutController.js'
import contactController from '../controllers/contactController.js'

const route =express.Router()
route.get("/",indexController)
route.get("/about",aboutController)
route.get("/contact",contactController)

export default route