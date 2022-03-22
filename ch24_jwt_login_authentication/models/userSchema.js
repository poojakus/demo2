import mongoose from 'mongoose'

//Schema
const userSchema =new  mongoose.Schema({
    name:{type:String , required:true, trim:true},
    email:{type:String , required:true, trim:true},
    password:{type:String , required:true},
    tc:{type:Boolean , required:true},
})
//model
const UserModel=new mongoose.model("user",userSchema)

//export
export default UserModel