import mongoose from "mongoose";

const modelRule=new mongoose.Schema(
    {
        name:{type:String,required:true,trim:true},
        age:{type:Number,required:true},
        fees:{type:mongoose.Decimal128,required:true,validate:(value)=>
        {
            value>=24000
        }}
    }
)

const StudentSChema=new mongoose.model("student",modelRule)

export default StudentSChema