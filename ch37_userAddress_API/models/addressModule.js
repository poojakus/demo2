import mongoose from "mongoose";
import userAuthentication from "../config/user-auth.js";

const addressSchema = new mongoose.Schema({
    AddressType: { type: String, required: true, trim: true },
    Addressline1: { type: String, required: true, trim: true },
    Addressline2: { type: String, required: true, trim: true },
    AreaName: { type: String, required: true, trim: true },
    CityName: { type: String, required: true, trim: true },
    StateName: { type: String, required: true, trim: true },
    CountryName: { type: String, required: true, trim: true },
    Pincode: { type: Number, required: true, trim: true },
    userid: { type: String },
});

const addressModel = mongoose.model("Address", addressSchema);

export default addressModel;
