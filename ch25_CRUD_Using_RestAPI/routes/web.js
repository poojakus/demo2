import express from 'express'
import StudentControler from '../controllers/StudentControllers.js'

const router =express.Router()

router.get("/",StudentControler.getAllDoc)
router.post("/",StudentControler.createDoc)
router.get("/:id",StudentControler.getSingleDocById)
router.put("/:id",StudentControler.updateDocById)
router.delete("/:id",StudentControler.deleteDocBYID)


export default router