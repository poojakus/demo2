import express from 'express'
import about from '../controllers/aboutControllers.js'
import home from '../controllers/homeControllers.js'

const route=express.Router();

route.get("/",home);
route.get("/about",about)


export default route