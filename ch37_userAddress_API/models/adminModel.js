import mongoose from "mongoose"

const AdminSchema=new mongoose.Schema(
    {
        name:{type:String,required:true,trim:true},
        email:{type:String,required:true,trim:true},
        password:{type:String,required:true,trim:true},
        createDate:{type:Date,required:true,trim:true}
    }
)

const AdminModel=mongoose.model("adminRagister",AdminSchema)

export default AdminModel