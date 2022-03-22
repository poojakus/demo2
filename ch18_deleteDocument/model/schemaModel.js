import mongoose  from "mongoose";

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

  //delete document by id
//    const deleteDocById= async(id)=>
//    {
//        try 
//        {
//            const result=await ss.findByIdAndDelete(id)
//            console.log(result)

          
//        } 
//        catch (error) 
//        {
//            console.log(error)

//        }
//    }


//deletOne
// const deleteDocByOne= async(id)=>
//    {
//        try 
//        {
//            const result=await ss.deleteOne({_id:id})
//            console.log(result)

          
//        } 
//        catch (error) 
//        {
//            console.log(error)

//        }
//    }


//delete many
const deleteDocMany= async(age)=>
   {
       try 
       {
           const result=await ss.deleteMany({collagename:age})
           console.log(result)

          
       } 
       catch (error) 
       {
           console.log(error)

       }
   }

export default deleteDocMany