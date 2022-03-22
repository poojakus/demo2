import AdminModel from "../models/adminModel.js"
import userModule from "../models/userModule.js"
import  Service from '../service/responseFunction.js'
import locallization from '../service/localization.js'
import bcrypt from 'bcrypt'
import flash from 'connect-flash'
// import Service from "../service/responseFunction.js"

class homeController
{
    static homePage=(req,res)=>
    {
        res.render('home',{title:'home'})
    }
    // static adminragister=async(req,res)=>
    // {

    //    const {name ,email, password, createdate}=req.body
    //    const user=await AdminModel.findOne({email:email})
    //    if(!user)
    //    {
    //         if(name && email && password && createdate)
    //         {
    //             const result=new AdminModel({
    //                 name:name,
    //                 email:email,
    //                 password:password,
    //                 createdate:createdate
    //             })

    //             const doc=await result.save()
    //             console.log(doc)
    //             res.render('home')

    //         }
    //         else
    //         {
    //             res.send({"message":"All fields are required...."})
    //         }
    //    }
    //    else
    //    {
    //        res.send({"message":"User is ragister already...."})
    //    }

    // }

    static CreateUser=(req,res)=>
    {
        res.render('create')
    }
    static UserCreate=async(req,res)=>
    {
        try {
            //validation
      
            // const err = validationResult(req);
            // if (!err.isEmpty()) {
            //   res.status(400).json({ err: err.array(0) });
            // }
            //end validation
      
            const { name, email, password, phone, gender } = req.body;
            const user = await userModule.findOne({ email: email });
            if (!user) {
              if (name && email && password && phone && gender) {
                //hash password making
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password, salt);
      
                const result = new userModule({
                  name: name,
                  email: email,
                  password: hashPassword,
                  phone: phone,
                  gender: gender,
                });
                const doc = await result.save();
                console.log("User Ragister=>", doc);
                // let mess='User Is ragister...'
        
                return res.redirect('tables')
    
              } else {
                res.status(200).json(Service.response(0, locallization.failed, null));
              }
            } else {
              res
                .status(400)
                .json(Service.response(0, locallization.emailalready, null));
            }
          } catch (error) {
            console.log(error);
          }
    }
    
    static AdminLogin=async(req,res)=>
    {
    
        const { email, password }=req.body

        const user=await AdminModel.findOne({email:email})
        console.log(user)

        if(email && password)
        {
            if(user)
            {
                if(user.email === email && user.password===password)
                {
                    return res.redirect('home')
                }
                else
                {
                    res.send("pass and email is not match..")
                }
            }
            else
            {
                res.send("user is Not ragister")
            }
        {

        }
        }
        else
        { 
            res.send("pls Fill All details...")

        }
        
        

    }

    static ListUser=async(req,res)=>
    {
        try {
            var title="hello"
            var  data=await userModule.find();
           const dataa=new Array(data)
           console.log(dataa)
        } catch (error) {
            console.log(error)
        }
    }
    static tableController=async(req,res)=>
    {
        var  data=await userModule.find();
        res.render('tables',{messq:req.flash('mess'),author: data} )
        console.log({messq:req.flash('mess')})
    }
    static EditCon=async(req,res)=>
    {
       try {
           
        const result=await userModule.findById(req.params.id)
        res.render('edit',{re:result})
       } catch (error) {
           console.log(error)
       }
    }
    static UpdateCon=async(req,res)=>
    {
       try {
           const {name,email,password,phone,gender}=req.body
           if(name && email && password && phone && gender)
           {
            const result=await userModule.findByIdAndUpdate(req.params.id,req.body)
            //res.render("home")
            
                  const ty= req.flash('mess','saved user')
                //    console.log("yuhyy",ty)
                   res.redirect('/tables')
            

           }
           else
           {
               res.send(Service.response(0,locallization.failed,null))
           }
           
        
       } catch (error) {
           console.log(error)
       }
    }
    static DeleteCon=async(req,res)=>
    {
       try {
           
        const result=await userModule.findByIdAndDelete(req.params.id)
        return res.redirect('/tables')
       } catch (error) {
           console.log(error)
       }
    }
}

export default homeController