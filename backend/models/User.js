import {model,Schema} from "mongoose";

const UserSchema=new Schema({
   name:{
      type:String,
      required:true
   },

   email:{
      type:String,
      required:true,
      unique:true
   },

   password:{
      type:String,
      required:true
   },

   role:{
      type:String,
      enum:["student","admin"],
      default:"student"
   },

   profileImageUrl:{
    type:String
   },

   rollNumber:String,

   branch:String,

   cgpa:Number,

   backlogs:{
      type:Number,
      default:0
   },

   phone:String,

   skills:[String],

   resume:String,

   resumeType: {
   type: String
   },

   resumeName: String,

   isPlaced:{
      type:Boolean,
      default:false
   },

   isActive:{
    type:Boolean,
    default:true
   }

},
{
    timestamps:true,
    strict:"throw",
    versionKey:false
}
);
export const User=new model('user',UserSchema);