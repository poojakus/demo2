class StudentController
{
    static set_cookie=(req,res)=>
    {
        res.cookie("name","pooja",{maxAge:30000})
        // res.cookie("age",23)
        res.send("Cookie is created....")
    }
    static get_cookie=(req,res)=>
    {
        console.log(req.cookies)
        console.log(req.cookies.name)
        console.log(req.cookies.age)
        res.send("Cookie is get....")
    }
    static clr_cookie=(req,res)=>
    {
        res.clearCookie("name")
        res.send("Cookie is clear....")
    }
}

export default StudentController