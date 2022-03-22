import mongoose from "mongoose";

const connectDb=async(DATABASE_URI)=>
{
    try 
    {
        const DATA_OPTION={
            dbname:'crud'
        }
        const result=mongoose.connect(DATABASE_URI,DATA_OPTION)
        console.log("Connection Successfully")
    } 
    catch (error) {
        console.log(error)
        
    }
}

export default connectDb