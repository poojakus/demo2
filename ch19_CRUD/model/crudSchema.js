import mongoose from "mongoose";

//create model
const crudSchema=mongoose.Schema(
    {
        name:{type:String,required:true,trim:true},
        age:{type:Number,required:true,min:18, max:55},
        fees:{type:Number,required:true,min:2000, max:90000}
    }
)

//compile model

const Modelschema=mongoose.model('colldetail', crudSchema)

export default Modelschema