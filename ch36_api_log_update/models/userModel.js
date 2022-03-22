import mongoose from "mongoose";

//creating Schema
const userSchema=new mongoose.Schema(
    {
        name:{type:String,required:true,trim:true},
        email:{type:String,required:true,trim:true},
        password:{type:String,required:true,trim:true},
        phone:{type:Number,required:true}
    }
)

//ceate module
const userModel=mongoose.model("user",userSchema)

//export module

export default userModel