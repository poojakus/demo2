import  mongoose  from "mongoose";


const connDb=async(DATABASE_URL)=>
{
    try 
    {
        const DB_OPTIONS=
        {
            dbName:'SchemaModuleEx'
        }

        await mongoose.connect(DATABASE_URL,DB_OPTIONS)
        console.log("Connection Successfully")
       
    }  catch (error) 
    {
        console.log(error)
    }

}

export default connDb