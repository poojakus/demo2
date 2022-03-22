import mongoose from "mongoose";

const connDb=async(DATA_UR)=>
{
    try {
        
      const  data_option={
            dbname:'myDB'
        }
    
        const conn=await mongoose.connect(DATA_UR,data_option)
        console.log("Connection Successfully.........")
    } catch (error) {
        console.log(error)
    }
}

export default connDb 