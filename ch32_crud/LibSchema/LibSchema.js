
import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    bname: { type: String, required: true, trim: true },
  bauthor: { type: String, required: true, trim:true },
  bprice: { type:mongoose.Decimal128, required: true }, 

});
// //const LibSchema= new mongoose.Schema({
//     bname:{
//         type:String,
//         required:true,
//         trim:true
//         },
//     bauthor:
//     {
//         type:String,
//         required:true,
//         trim:true
//     },
//     bprice:
//     {
//         type:mongoose.Decimal128,
//         required:true,
//         validate:(value)=>value>=1200.5}
    

// })

//model
const LibModel=mongoose.model("LibDatabase",StudentSchema);


//export
export default LibModel

