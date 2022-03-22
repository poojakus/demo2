import StudController from "../controllers/studentController.js"
import express from 'express'

const route=express.Router()

route.get("/get",StudController.getall)
route.post("/create",StudController.create)

export default route