import mongoose from "mongoose";

const connection=async(data_url)=>
{
    try
     {
         const data_option={
             dbname:'sutu'
         }

        const doc=mongoose.connect(data_url,data_option)
        console.log("Connection succesfully....")
    } catch (error)
     {
       console.log(error) 
    }
}

export default connection 