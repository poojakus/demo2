import mongoose from "mongoose";

const DBConnect=async(DBURL)=>
{
   try {
    const options=
    {
        dbname:process.env.DBNAME
    }
    const conn=await mongoose.connect(DBURL,options)
    console.log("Connection Successfully...")
       
   } catch (error) {
       console.log(error)
   }

}

export default DBConnect