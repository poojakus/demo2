import express from 'express'
//controller
import LibController from '../controllers/libController.js'

const route=express.Router()

route.get("/",LibController.getAll)
route.post("/",LibController.creatNew)
route.get("/:id",LibController.getById)
route.put("/:id",LibController.update)
route.delete("/:id",LibController.delete)


//export router
export default route