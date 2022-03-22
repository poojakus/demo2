import mongoose from "mongoose"

//create schema 
const userSchema=new mongoose.Schema(
    {
        name:{type:String,required:true,trim:true},
        email:{type:String,required:true,trim:true,unique:true},
        password:{type:String,required:true},
        phone:{type:Number,unique:true,trim:true},
        address:{type:String,trim:true},
        twitter:{type:String,trim:true}

    }
)
//compiling schema and make module
const userModel=mongoose.model("user",userSchema)

//export module
export default userModel

