import { Schema,model } from "mongoose"
const companySchema = new Schema({

   name:{
      type:String,
      required:true
   },

   description:{
      type:String
   },

   location:{
      type:String
   },

   package:{
      type:Number
   },

   website:{
      type:String
   },

   eligibility:{
      minCGPA:Number,
      maxBacklogs:Number,
      branches:[String]
   }

},
{
   timestamps:true,
   strict:"throw",
   versionKey:false
})

export const Company=new model('company',companySchema);