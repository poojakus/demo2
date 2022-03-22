import expree from 'express'



const app=expree()
const port=process.env.port

app.get("/",(req,res)=>
{
    res.send("Hello this is work successfully")
})


app.listen(port,()=>
{
    console.log(`Server is listing on port http://localhost:${port}`)
})
