import express from "express";
import userController from "../controllers/userController.js";
import { body } from "express-validator";

const route = express.Router();

route.post(
  "/ragister",
  [
    body("name")
      .not()
      .isEmpty()
      .trim()
      .isLength({ min: 4 })
      .withMessage("Please enter Your name less than 4 charchter"),
    body("email")
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("PLease enter valid email"),
    body("password")
    .not()
    .isEmpty()
    .trim()
    .withMessage("Pls provide Password"),
    body("phone")
      .not()
      .isEmpty()
      .trim()
      .withMessage("Pls provide Phone NUmber"),
    body("gender")
    .not()
    .isEmpty()
    .trim()
    .withMessage("Pls provide gender"),
    // body('email').not().isEmpty().isEmail().withMessage("Please Enter valid email.."),
  ],
  userController.userRagistration
);

route.post(
  "/login",
  [
    body("email")
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("PLease enter valid email"),
    body("password").not().isEmpty().withMessage("Please enter password"),
  ],
  userController.userLogin
);

export default route;
