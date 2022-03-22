import express from 'express'
import  validate  from '../config/validation.js'
import { body } from 'express-validator'
import userController from '../controllers/userController.js'
import userAuthentication from '../middleware/user-auth.js'


//swagger actions

/**
 * @swagger
 * /user/ragister:
 *   post:
 *     summary: User Ragistration
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
 *               conf_password:
 *                 type: string
 *               phone:
 *                 type: integer
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
 */


/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
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
 */



/**
 * @swagger
 * /user/updateUser:
 *   put:
 *     parameters:
 *      - in: header
 *        name: token
 *        required: true
 *        default: 9067b6a045f321090ea476eaec169002c5e335a540cd77b5726c7547b2bf5209 
 *     summary: Update user
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
 *       401:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responsecode:
 *                   type: integer
 *                 responseMessage:
 *                    type: string
 */

const route=express.Router()

//autntication middleware
// route.use('/updateUser',userAuthentication)

//public routes
route.post("/ragister",[
    body('name').trim().not().isEmpty().isLength({min:4}).
    withMessage("Please enter a valid  name,minimumm  4 charcter long"),
    body('email').not().isEmpty().isEmail().withMessage("Please Enter valid email.."),
    body('password').not().isEmpty().trim().withMessage("Please do not leave empty password"),
    body('conf_password').not().isEmpty().trim().withMessage("Please do not leave empty password"),
    body('phone').trim().not().isEmpty().isNumeric().isLength({min:5}).withMessage("Please enter valid mobile no. only numbeer more than 5 digits")

],userController.ragisterUser)
route.post("/login",[
    body('email').not().isEmpty().isEmail().withMessage("Please Enter valid email.."),
    body('password').not().isEmpty().trim().withMessage("Please do leave not empty password")
],userController.loginUser)

//protected routes
route.put("/updateUser",userAuthentication,userController.UpdateUser)



//export
export default route