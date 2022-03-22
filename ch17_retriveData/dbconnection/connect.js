import mongoose from "mongoose";


const Db_Connect=async(DATABASE_URI)=>
{
    try 
    {
        const DB_OPTIONS={
            dbname:'College'
        }

        await mongoose.connect(DATABASE_URI,DB_OPTIONS)
        console.log("Connection  Successfully")
    } catch (error) {
        console.log(error)
        
    }
}

export default Db_Connect