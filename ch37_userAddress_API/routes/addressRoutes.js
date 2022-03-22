import addressController from "../controllers/addressController.js";
import express from "express";
import userAuthentication from "../config/user-auth.js";
import { body } from "express-validator";

const route = express.Router();

/**
 * @swagger
 * /user/ragister:
 *   post:
 *     summary: User Ragistration
 *     tags: [user]
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
 *               gender:
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
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     password:
 *                       type: string
 *                     gender:
 *                       type: string
 *                     phone:
 *                       type: string 

 * 
 *       
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User Login
 *     tags: [ user]
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
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     password:
 *                       type: string
 *
 *
 */

/**
 * @swagger
 * /listalldata:
 *   get:
 *     tags: [Address]
 *     summary: List All Address
 *     parameters:
 *      - in: query
 *        name: perPage
 *        required: false
 *        schema:
 *          type: number
 *          default: 10
 *        description: Number of Records Per Page
 *      - in: query
 *        name: page
 *        required: false
 *        schema:
 *          type: number
 *          default: 10
 *        description: Number of Records Page
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
 *                     _id:
 *                       type: string
 *                     AddressType:
 *                       type: string
 *                     AddressLine1:
 *                       type: string
 *                     AddressLine2:
 *                       type: string
 *                     AreaName:
 *                       type: string
 *                     CityName:
 *                       type: string
 *                     Statename:
 *                       type: string
 *                     CountryName:
 *                       type: string
 *                     Pincode:
 *                       type: integer
 */

/**
 * @swagger
 * /createAddress:
 *   post:
 *     summary: add new category
 *     tags: [Address]
 *     parameters:
 *      - in: header
 *        name: accessToken
 *        required: true
 *        default: 9067b6a045f321090ea476eaec169002c5e335a540cd77b5726c7547b2bf5209
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               AddressType:
 *                 type: string
 *               Addressline1:
 *                 type: string
 *               Addressline2:
 *                 type: string
 *               AreaName:
 *                 type: string
 *               CityName:
 *                 type: string
 *               StateName:
 *                 type: string
 *               CountryName:
 *                 type: string
 *               Pincode:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Login success
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
 *                     AddressType:
 *                       type: string
 *                     AddressLine1:
 *                       type: string
 *                     AddressLine2:
 *                       type: string
 *                     AreaName:
 *                       type: string
 *                     CityName:
 *                       type: string
 *                     Statename:
 *                       type: string
 *                     CountryName:
 *                       type: string
 *                     Pincode:
 *                       type: integer
 *       500:
 *         description: Login failed
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

/**
 * @swagger
 * /updateAddress/{id}:
 *   put:
 *     summary: Update Address
 *     tags: [Address]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        default: 62135da7f0101fbf40ad91ba
 *      - in: header
 *        name: accessToken
 *        required: true
 *        default: 9067b6a045f321090ea476eaec169002c5e335a540cd77b5726c7547b2bf5209
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               AddressType:
 *                 type: string
 *               Addressline1:
 *                 type: string
 *               Addressline2:
 *                 type: string
 *               AreaName:
 *                 type: string
 *               CityName:
 *                 type: string
 *               StateName:
 *                 type: string
 *               CountryName:
 *                 type: string
 *               Pincode:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Login success
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
 *                     AddressType:
 *                       type: string
 *                     AddressLine1:
 *                       type: string
 *                     AddressLine2:
 *                       type: string
 *                     AreaName:
 *                       type: string
 *                     CityName:
 *                       type: string
 *                     Statename:
 *                       type: string
 *                     CountryName:
 *                       type: string
 *                     Pincode:
 *                       type: integer
 *       500:
 *         description: Login failed
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

/**
 * @swagger
 * /deleteAddress/{id}:
 *   delete:
 *     summary: Delete Address
 *     tags: [Address]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        default: 62135da7f0101fbf40ad91ba
 *      - in: header
 *        name: accessToken
 *        required: true
 *        default: 9067b6a045f321090ea476eaec169002c5e335a540cd77b5726c7547b2bf5209
 *     responses:
 *       200:
 *         description: Login success
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
 *                     AddressType:
 *                       type: string
 *                     AddressLine1:
 *                       type: string
 *                     AddressLine2:
 *                       type: string
 *                     AreaName:
 *                       type: string
 *                     CityName:
 *                       type: string
 *                     Statename:
 *                       type: string
 *                     CountryName:
 *                       type: string
 *                     Pincode:
 *                       type: integer
 *       500:
 *         description: Login failed
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

//public routes
route.get("/listalldata", addressController.ListAddress);

//protected routes
route.post(
  "/createAddress",
  userAuthentication,
  [
    body('AddressType').not().isEmpty().withMessage("Please Enter Address Type"),
    body('Addressline1').not().isEmpty().trim().withMessage("Pls provide AddressLine1..."),
    body('Addressline2').not().isEmpty().trim().withMessage("Pls Provide AddressLine2.."),
    body('AreaName').not().isEmpty().trim().withMessage('pls provide Areaname'),
    body('CityName').not().isEmpty().trim().withMessage('pls provide City Name'),
    body('StateName').not().isEmail().trim().withMessage('Pls provide valid State Name'),
    body('CountryName').not().isEmpty().trim().withMessage('Pls Provide Valid Country Name'),
    body("Pincode")
      .not()
      .isEmpty()
      .trim()
      .withMessage("Please enter valid Pin code")
  ],
  addressController.addAddress
);
route.put(
  "/updateAddress/:id",
  userAuthentication,
  addressController.UpdateAddress
);
route.delete(
  "/deleteAddress/:id",
  userAuthentication,
  addressController.DeleteAddress
);

export default route;
