import Mongoose from "mongoose";
//import { Schema } from "mongoose"; agr ye import karte haito mongose.schema likhne ki jarurat nhi hai

//defineing Schema
const StudentSchema = new Mongoose.Schema({
  // name :String,
  // age: Number
  // id:Number,
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 18, max: 55 },
  fees: { type: Number, required: true }, //validate:v=>v=>5500.50
  hobbies: { type: Array },
  isactive: { type: Boolean },
  comment: [
    { value: { type: String }, publish: { type: Date, default: Date.now } },
  ],
  join: { type: Date, default: Date.now },
});

//konw your path field
//console.log(StudentSchema.path('age'))

//compiling  Schema

const studentSch = Mongoose.model("student", StudentSchema);

// const createDoc = async () => {
//   try {
//     //creating new Document
//     const studentDoc = new studentSch({
//       //id:101,
//       name: "Aarti kushwaha",
//       age: 18,
//       fees: 19000,
//       hobbies: ["singing", "coading", "reading"],
//       isactive: true,
//       comment: [{ value: "Aarti is good girl" }],
//     });
//     //saving Document
//     const result = await studentDoc.save();
//     console.log(result);
//   } catch (error) {
//     console.log(error);
//   }
// }

//insert data throgh paeameter
const createDoc = async (nm,ag,fee,hob,isac,com) => {
    try {
      //creating new Document
      const studentDoc = new studentSch({
        //id:101,
        name:nm,
        age: ag,
        fees:fee,
        hobbies:hob,
        isactive:isac,
        comment:com,
      });
      //saving Document
      const result = await studentDoc.save();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

//insert document many

// const createDoc = async () => {
//     try {
//       //creating new Document
//       const studentDoc = new studentSch({
//         //id:101,
//         name: "Vishal kushwaha",
//         age: 28,
//         fees: 29000,
//         hobbies: ["singing", "coading", "reading"],
//         isactive: true,
//         comment: [{ value: "Vishal is good girl" }],
//       })
//       const guddiDoc = new studentSch({
//         //id:101,
//         name: "Guddi kushwaha",
//         age: 38,
//         fees: 22000,
//         hobbies: ["singing", "coading", "reading"],
//         isactive: true,
//         comment: [{ value: "Guddi is good girl" }],
//       })
//       const bbkivine = new studentSch({
//         //id:101,
//         name: "BBkiVines kushwaha",
//         age: 55,
//         fees: 190000,
//         hobbies: ["singing", "coading", "reading"],
//         isactive: true,
//         comment: [{ value: "BBki vines is good girl" }],
//       })
//       //saving Document
//       const result = await studentSch.insertMany([studentDoc,guddiDoc,bbkivine]);
//       console.log(result);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//export default createDoc
