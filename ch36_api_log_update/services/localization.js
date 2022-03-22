export class localization
{
    static response=(status,message,data)=>
    {
        return {
            status:status,
            message:message,
            data:data
        }
    } 
}



export default localization