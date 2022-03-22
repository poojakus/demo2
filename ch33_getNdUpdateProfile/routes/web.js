import express from 'express'
import userController from '../controllers/userController.js'

//swaggger apis

/**
 * @swagger
 * /user/:
 *   get:
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                 responseMessage:
 *                   type: string
 *                 responseData:
 *                   type: object
 *                   properties:
 *                     list:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 618b6b34abf094b8e31e4f27
 *    
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         default: 62273e91852e5af41ad69488
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                 responseMessage:
 *                    type: string
 *                 responseData:
 *                   type: object
 *                   properties:
 *                      list:
 *                          type: array
 *                          items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 618b6b34abf094b8e31e4f27
 *     
 *       
 * 
 */

/**
/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update User Profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         default: 62273e91852e5af41ad69488
  *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: integer
 *               address:
 *                 type: string
 *               twitter:
 *                 type: string
 *          
 *                  
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                 responseMessage:
 *                    type: string
 *                 responseData:
 *                   type: object
 *                   properties:
 *                      list:
 *                          type: array
 *                          items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 618b6b34abf094b8e31e4f27
 *     
 *       
 * 
 */


//making router
const route=express.Router()
route.get("/",userController.getAllProfile)
route.get("/:id",userController.getProfile)
route.post("/",userController.create)
route.put("/:id",userController.update)



//export route
export default route