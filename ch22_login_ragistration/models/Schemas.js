import mongoose from "mongoose";

//defingig Schema
const schemaMoel=new mongoose.Schema(
    {
        name:{type:String,required:true, trim:true,},
        email:{type:String ,required:true, trim:true,unique:true},
        password:{type:String,required:true,trim:true},
        join: {type:Date,default:Date.now}

    }
)

const userModel=new mongoose.model("user",schemaMoel)

export default userModel