import mongoose from "mongoose";

const ConnectDb=async(DATA_URL)=>
{
    try {
        const DATA_OPTION=
        {
            dbname:process.env.DBNAME
        }
        const conn=await mongoose.connect(DATA_URL,DATA_OPTION)
        console.log("Connection succesfully...")
    } catch (error) 
    {
        console.log(error)
    }

}

export default ConnectDb