import {connect} from "mongoose";
import {config} from "dotenv"

config()
export const connectDB=async()=>{
    try{
        await connect(process.env.DB_URL);
        console.log("DB Connection Successfull");
    }catch(err){
        console.log("error in connecting Database",err);
    }
}