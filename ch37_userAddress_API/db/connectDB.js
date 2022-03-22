import mongoose from "mongoose";

const connectDB=async(DATAURL)=>
{
    try {
        const DATAOPTION=
        {
            dbname:process.env.DBNAME
        }
        const connect=mongoose.connect(DATAURL,DATAOPTION)
        console.log("Connection Successfully......")
        
    } catch (error)
     {
        console.log(error)
    }
}

//export connection
export default connectDB