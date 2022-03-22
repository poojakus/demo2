import mongoose from "mongoose";

const personShecma=new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true},
    password:{type:String,required:true,trim:true},

})

const PersonModel=mongoose.model("person123",personShecma)

export default PersonModel