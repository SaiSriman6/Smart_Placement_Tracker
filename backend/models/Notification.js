import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
{
   user:{
      type:Schema.Types.ObjectId,
      ref:"User",
      required:true
   },

   title:{
      type:String,
      required:true
   },

   message:{
      type:String,
      required:true
   },

   isRead:{
      type:Boolean,
      default:false
   },

   type:{
   type:String,
   enum:["DRIVE","RESULT","INTERVIEW","GENERAL"]
   }

},
{
   timestamps:true,
   strict:"throw",
   versionKey:false
});

export const Notification = new model("Notification",notificationSchema);