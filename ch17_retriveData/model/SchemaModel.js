import mongoose from "mongoose";

//ceate schema or rules
const scSchma = new mongoose.Schema({
  collagename: { type: String, required: true, trim: true },
  collageage: { type: Number, required: true },
  noOfTeacher: { type: Number, required: true },
  noClassOfTeacher: { type: Number, required: true },
  collageIsok: { type: Boolean, required: true },
  establishDate: { type: Date, default: Date.now },
  comment: [
    { value: { type: String }, publish: { type: Date, default: Date.now } },
  ],
});
//create document compiling schema
const ss = new mongoose.model("detailcollage", scSchma);

// const inserDoc = async () => {
//   try {
//     const data1 = new ss({
//       collagename: "kala",
//       collageage: 56,
//       noOfTeacher: 45,
//       noClassOfTeacher: 124,
//       collageIsok: false,
//       comment: [{ value: "this is good college" }],
//     });
//     const data2 = new ss({
//         collagename: "kajal",
//         collageage: 56,
//         noOfTeacher: 49,
//         noClassOfTeacher: 13,
//         collageIsok: true,
//         comment: [{ value: "this is good college" }],
//       });
//       const data3 = new ss({
//         collagename: "AArti",
//         collageage: 25,
//         noOfTeacher: 15,
//         noClassOfTeacher: 13,
//         collageIsok: true,
//         comment: [{ value: "this is good college" }],
//       });
//     const result = await ss.insertMany([data1,data2,data3]);
//     console.log(result);
//   } catch (error) {
//     console.log(error);
//   }
// };

//get all document 
// const getall=async()=>
// {
//     const data=await ss.find()
//     data.forEach(
//         (element) =>console.log(element.collagename,element.collageage)
        
//     );
// }

// const getSpecificdata=async()=>
// {
//     // const data=await ss.find().select('collagename noOfTeacher collageage')//include
//     //const data=await ss.find().select('-collageage -collagename')//exclude
//     const data=await ss.find({},'-collageage -collagename')
//     // const data=await ss.find({},'collageage collagename')
//     console.log(data)
// }


// const getSingleData=async()=>
// {
//     const result=await ss.findById('621c8a800f0a1679e1506613')
//     console.log(result)
// }

//get document by field

// const getDocByField=async()=>
// {
//     // const result=await ss.find({collagename:'pooja'})
//     // const result=await ss.find({collageage:56})
//     //const result= await ss.find().limit(2)
//     //const result=await ss.find().skip(1)
//     //const result=await ss.find().countDocuments()
//     // const result=await ss.find().sort({collagename:1})//sorting
//     //comparison oparator
//     // const result=await ss.find({collageage:{$gt:25}})//grater
//     //grater or equal to
//     // const result=await ss.find({collageage:{$gte:56}})
//     //lessthan 
//     // const result=await ss.find({collageage:{$lt:54}})
//     //less than equal to
//     // const result=await ss.find({collageage:{$lte:34}})
//     //not equal to
//     // const result=await ss.find({collageage:{$ne:25}})
//     //in oprator
//     // const result=await ss.find({collageage:{$in:[25,56]}})
//     // console.log(result)
// // }

// const getDocLogical=async()=>
// {
//     // const result=await ss.find({$and:[{collageage:56},{collagename:'kala'}]})and oprator
//     const result=await ss.find({$or:[{collageage:56},{collagename:'kalaj'}]})
//     console.log(result)
// }

// const updateDocById=async(id)=>
// {
//     // const result=await ss.findByIdAndUpdate(id,{collagename:"kushwaha"})
//     const result=await ss.findByIdAndUpdate(id,{collagename:"ninja"},{returnDocument:"after"})//upade k bad ka data dega

//     console.log(result)
// }

// const updateSingDocument=async(id)=>
// {
//     // const result=await ss.updateOne({_id:id},{collagename:'niju'})
//     // update or insert
//     const result=await ss.updateOne({_id:id},{collagename:'mika'},{upsert:true})
    

//     console.log(result)
// }

const updateManyDocument=async(n)=>
{
    // const result=await ss.updateOne({_id:id},{collagename:'niju'})
    // update or insert
    // const result=await ss.updateMany({collagename:n},{collagename:'nikita'})
    //update or upsert
    const result=await ss.updateMany({collagename:n},{collagename:'kikkk'},{upsert:true})
    

    console.log(result)
}

export default updateManyDocument
