import Modelschema from "../model/crudSchema.js";

class StudentController {
  static createDoc =async(req, res) =>
   {
     try 
     {
      //console.log("Data Is cerated!")

      //Destructure of data req.body.name
      const {name,age,fees}=(req.body)

      const doc=new Modelschema({
        name:name,
        age:age,
        fees:fees
      })
      //saving the document into collection 
      const result=await doc.save()
      //printing in console
      console.log(result)
       
 
      res.render("index")
       
     } catch (error)
      {
        console.log(error)
     }
    
  }

  static editeDoc = async(req, res) =>
   {
     //req.params dyanimicall values ko store karta hai or request karta hai id dene ke liye parameter ki
    try
     {
      //console.log(req.params.id)
      const result=await Modelschema.findById(req.params.id)
      
      console.log(result)
 
      res.render("edit.ejs",{data:result})
      
    } catch (error) 
    {
      console.log(error)
    }
  }
  static updateDocById = async(req, res) => 
  {
    // console.log(req.params.id)
    // console.log(req.body)
    try
     {
       const result=await Modelschema.findByIdAndUpdate(req.params.id,req.body)
      res.redirect("/")
    } catch (error)
     {
      console.log(error)
    }
    
  }

  static getAllDoc = async (req, res) => {
    try {
      const result12 = await Modelschema.find()

      //console.log(result);
      //res.render("edit.ejs",{data:result})
      res.render("index",{data12:result12})
    } catch (error) {
      console.log(error);
    }
   
  }

  static deleteDocById = async(req, res) => 
  {
    try 
    {
      const dele=await Modelschema.findByIdAndDelete(req.params.id)
      res.redirect("/")
      
      
    } catch (error)
     {
       console.log(error)
      
    }
    // console.log(req.params.id)
    
   
    
  }
}

export default StudentController;
