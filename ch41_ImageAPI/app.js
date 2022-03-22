import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import multer from 'multer'
import path from 'path'

const app=express()
const port=process.env.PORT

const storage=multer.diskStorage(
    {
        destination:'./upload/images',
        filename:(req,file,cb)=>
        {
            return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
        }
    }
)

const upload=multer(
    {
        storage:storage,
        limits:{fileSize:100000000}
    }
)
app.post("/upload",upload.single('profile'),(req,res)=>
{
   res.json({"status":1,"profile_url":`http://localhost:${port}/upload/${req.file.filename}`})
})

function errHandler(err,req,res,next)
{
    if(err instanceof multer.MulterError)
    {
        res.json(
            {
                "status":0,
                "message":err.message
            }
        )
    }
}

app.listen(port,()=>
{
    console.log(`Server is listinig on http://localhost:${port}`)
})