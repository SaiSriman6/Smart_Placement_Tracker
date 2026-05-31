import { Schema,model } from "mongoose"
const applicationSchema = new Schema({

   student:{
      type:Schema.Types.ObjectId,
      ref:"user"
   },

   drive:{
      type:Schema.Types.ObjectId,
      ref:"drive"
   },

   currentRound:{
      type:Number,
      default:0
   },

   status:{
      type:String,
      enum:[
         "applied",
         "shortlisted",
         "round1",
         "round2",
         "selected",
         "rejected"
      ],
      default:"applied"
   },

   appliedAt:{
      type:Date,
      default:Date.now
   }
},
{
    timestamps:true,
    strict:"throw",
    versionKey:false
})

export const Application=new model('application',applicationSchema);
