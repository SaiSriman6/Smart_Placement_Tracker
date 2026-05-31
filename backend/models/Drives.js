import { Schema,model } from "mongoose"
const driveSchema = new Schema({

   company:{
      type:Schema.Types.ObjectId,
      ref:"company"
   },

   title:{
      type:String
   },

   description:{
     type:String
   },

   driveDate:{
      type:Date
   },

   lastDateToApply:{
      type:Date
   },

   location:{
      type:String
   },

   mode:{
      type:String,
      enum:["online","offline"]
   },

   rounds:[
      {
         roundNo:Number,
         title:String,
         date:Date
      }
   ],

   status:{
      type:String,
      enum:["upcoming","ongoing","completed"],
      default:"upcoming"
   }

},
{timestamps:true,
 strict:"throw",
 versionKey:false   
})

export const Drive = new model('drive',driveSchema);