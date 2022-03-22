import express from 'express'
import studentCont from '../controllers/StudentController.js'


const route=express.Router()

route.get("/ses",studentCont.get_Session_info)

export default route

