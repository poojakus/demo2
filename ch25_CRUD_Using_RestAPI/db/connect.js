import mongoose from "mongoose";

const connectDB=async(db_url)=>
{
   try 
   { 
       const db_option=
       {
        dbname:process.env.dbnn
       }
       const result=await mongoose.connect(db_url,db_option)
    console.log("Connection established....")
   }
       
    
   catch (error) 
   {
       console.log(error)
   }

}
export default connectDB