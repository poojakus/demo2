import mongoose from "mongoose";

const connectDB=async(DATA_URL)=>
{
    try {
        const DATA_OPTION=
        {
            dbname:process.env.DBNAME
        }
        const conn=await mongoose.connect(DATA_URL,DATA_OPTION)
        console.log("Successfully Connected..")
        
    } catch (error)
     {
        console.log(error)
    }
}

export default connectDB