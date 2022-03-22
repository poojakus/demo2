import  Mongoose  from "mongoose";

const connectDB=async(DATABASE_URI)=>
{
    try 
    {
        
        const DB_OPTIONS=
        {
            dbname:'College'
        }
        await Mongoose.connect(DATABASE_URI,DB_OPTIONS)
        console.log("Successfully Connected")
        
    } 
    catch (error) 
    {
        console.log(error)
        
    }

}

export default connectDB
