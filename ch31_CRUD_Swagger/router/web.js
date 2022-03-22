import express from 'express'
import LibController from '../controllers/LibraryController.js'

const router=express.Router()

router.get("/getall",LibController.getAllBook)
router.get("/create",LibController.createBook)


export default router