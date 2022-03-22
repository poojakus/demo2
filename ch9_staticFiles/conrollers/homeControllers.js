import {join} from 'path'

const homeControllers=(req,res)=>
{
    res.sendFile(join(process.cwd(), 'views', 'index.html'))
}

export default homeControllers 