import userController from "../controllers/userControllers.js";
import express from 'express'

const router=express.Router()

router.get("/",userController.index)


export default router