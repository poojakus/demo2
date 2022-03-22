import addressModel from "../models/addressModule.js";
import Service from "../service/responseFunction.js";
import localization from "../service/localization.js";
import { validationResult } from "express-validator";
import httpStatus from "../service/httpSatus.js";
// import addressModel from "../models/addressModule.js";

class addressController {
  static addAddress = async (req, res) => {
    console.log("Hello");
    // console.log(user)
    // res.send({"user":req.user})
    const userInfo = req.user;

    const addrestype = ["home", "office", "other", "Home", "Office", "Other"];
    // const {
    //   AddressType,
    //   Addressline1,
    //   Addressline2,
    //   AreaName,
    //   CityName,
    //   StateName,
    //   CountryName,
    //   Pincode,
    //   userid,
    // } = req.body;
    // userid=userInfo.id
    // if (
    //   AddressType &&
    //   Addressline1 &&
    //   Addressline2 &&
    //   AreaName &&
    //   CityName &&
    //   StateName &&
    //   CountryName &&
    //   Pincode
    // ) {
      if (addrestype.includes(req.body.AddressType)) {
        //validation

        const err = validationResult(req);
        if (!err.isEmpty()) {
          res.status(400).json({ err: err.array() });
        }
        //end validation
        const result = new addressModel({
          AddressType: req.body.AddressType,
          Addressline1: req.body.Addressline1,
          Addressline2: req.body.Addressline2,
          AreaName: req.body.AreaName,
          CityName: req.body.CityName,
          StateName: req.body.StateName,
          CountryName: req.body.CountryName,
          Pincode: req.body.Pincode,
          userid: req.user.id,
        });
        const doc = await result.save();
        console.log(doc);
        res.json(
          Service.response(httpStatus.Successfully, localization.allDataSaveInAddressTable, {"id":doc._id})
        );
      } else {
        res.send(Service.response(httpStatus.Failed, localization.invalidaddresstype, null));
      }
  };

  static ListAddress = async (req, res) => {
    try {
      // const {page=1,limit=2}=req.query;
      var perPage = req.query.perPage > 0 ? parseInt(req.query.perPage) : 10
      var page = req.query.page > 0 ? parseInt(req.query.page)-1 : 0
      const result = await addressModel.find().limit(perPage).skip((page*perPage));
      res.json(
        Service.response(1, localization.dataRetriveSuccessfully,{"id":result})
      );
    } catch (error) {
      res.send(Service.response(0, localization.dataRetriveFaield, null));
    }
  };

  static UpdateAddress = async (req, res) => {
    const userInfo = req.user;
    const addrestype = ["home", "office", "other", "Home", "Office", "Other"];
    const { AddressType } = req.body;

    try {
      if (addrestype.includes(AddressType)) {
        const result = await addressModel.findByIdAndUpdate(
          req.params.id,
          req.body
        );
        console.log(result);
        res.json(Service.response(1, localization.userUpdateSuccess, result));
      } else {
        res.send(Service.response(0, localization.invalidaddresstype, null));
      }
    } catch (error) {
      res.json(Service.response(0, localization.noUpdate, error));
    }
  };

  static DeleteAddress = async (req, res) => {
    try {
      const result = await addressModel.findByIdAndDelete(req.params.id);
      console.log(result);
      res.json(Service.response(1, localization.userDeleteSuccess, result));
    } catch (error) {
      res.json(Service.response(0, localization.noUserDelete, error));
    }
  };
}

export default addressController;
