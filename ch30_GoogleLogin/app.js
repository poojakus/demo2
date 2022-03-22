import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()
//google Auth
import { OAuth2Client } from 'google-auth-library'
const CLIENT_ID="774219446887-hqqj1n6nhaadnpa99vj6cede45lj4ht8.apps.googleusercontent.com"
const client = new OAuth2Client(CLIENT_ID);

const app=express()
const port=process.env.PORT

//set view enfine
app.set("view engine","ejs")
app.use(express.json())
app.use(cookieParser())

app.get("/",(req,res)=>
{
    res.render("index")
})

app.get("/login",(req,res)=>
{
    res.render("login")
})

app.post("/login",(req,res)=>
{
    let token=req.body.token
    console.log(token)
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
        console.log(payload)
      }
      verify().then(()=>
      res.cookie('session-token',token)).
      catch(console.error);
})

app.listen(port,()=>
{
    console.log(`Server is listing on http://localhost:${port}`)
})
