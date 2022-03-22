import mongoose from 'mongoose'

const connectDB=async(DATABASE_URL)=>
{
    try
    { 
            const DB_OPTIONS={
                user:'pooja123',
                pass:'12345',
                dbName:'SchoolDb',
                authSource:'SchoolDb'
            }
            await mongoose.connect(DATABASE_URL,DB_OPTIONS);
            console.log("Connected Successfully")
    }
    catch(err)
    {
        console.log(err);
    }
}

export default connectDB
