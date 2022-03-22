import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import multer from 'multer'
import path from 'path'

const app=express()
const port=process.env.PORT || 4000


//ejs
app.set("view engine","ejs")

const storage=multer.diskStorage(
    {
        destination:'./public/image/',
        filename:function(req,file,cb)
        {
            cb(null,file.fieldname+'-'+Date.now()+ path.extname(file.originalname));
        }
    }
)
//init upload
const upload=multer(
    {
        storage:storage,
        limits:{fileSize: 10000000000},
        fileFilter:function(req,file,cb)
        {
            checkFileType(file,cb)
        }
    }
).single('image')
//check file type
function checkFileType(file,cb)
{
    //allowd ext
    const fileTypes=/jpeg|jpg|png|gif/;
    //check ext
    const extname=fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    //check mime
    const mimetype=fileTypes.test(file.mimetype);
    if(mimetype && extname)
    {
        return cb(null,true);
    }
    else
    {
        cb('Error: Image Only!');
    }
}

//public
app.use(express.static("./public"))
app.get("/",(req,res)=>
{
    res.render("index")
})
app.post("/upload",(req,res)=>
{
    upload(req,res,(err)=>
    {
        if(err)
        {
            res.render('index',{ msg : err });
        }
        else
        {
            if(req.file==undefined)
            {
                res.render('index',{
                    msg:'Error: No File Selected..'
                });
            }
            else
            {
                res.render('index',{
                    msg:'File Uploaded!!!!!',
                    file:`image/${req.file.filename}`
                })
            }
        }
    });
});

app.listen(port,()=>
{
    console.log(`Server is listing on http://localhost:${port}`)
})