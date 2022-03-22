import express  from 'express'
import homeController from '../conrollers/homeControllers.js'


const route=express.Router()
route.get("/",homeController)

export default route
