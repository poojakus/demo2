import mongoose from "mongoose";

const LibSchema=new mongoose.Schema(
    {
        bname:{type:String,required:true,trim:true},
        bauth:{type:Number,required:true},
        bprice:{type:mongoose.Decimal128,required:true}
        
    }
)

const LibModel=mongoose.model("bookManagement",LibSchema)

export default LibModel

