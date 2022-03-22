import mongo from 'mongoose'

const connectDB=async(DATA_UR)=>
{
    try 
    {
        const DATA_OP={
            dbname:process.env.dname
        }

        const conn=await mongo.connect(DATA_UR,DATA_OP)
        console.log("Connection Successfully....")
    }
    catch (error) 
    {
        console.log(error)
    }
    
}
export default connectDB