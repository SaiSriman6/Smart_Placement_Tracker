import {User} from "../models/User.js"
import bcrypt from "bcryptjs";
import {authenticate} from "../services/authServices.js"
import { register } from "../services/authServices.js";



export const login = async (req, res) => {

   try {

      const result = await authenticate(req.body);

      res.cookie("token", result.token, {
         httpOnly: true,
         sameSite: "none",
         secure: true
      });

      return res.status(200).json({
         message: "Login successful",
         user: result.user
      });

   } catch (err) {

      return res.status(err.status || 500).json({
         message: err.message
      });
   }
};


export const signup = async (req, res) => {

   try {

      const user = await register(req.body);

      return res.status(201).json({
         message: "User registered",
         user
      });

   } catch (err) {

      return res.status(err.status || 500).json({
         message: err.message
      });
   }
};


export const getUsers = async(req,res)=>{
    try{
        let users=await User.find();
        res.status(200).json({message:"All Users",payload:users});
    }catch(err){
        console.log(err);
    }
}

export const getUserById=async(req,res)=>{
    try{
        let userId=req.params.id;
        let user=await User.findOne({_id:userId})
        if(!user){
            res.status(400).json({message:"User not found",payload:user});
        }
        res.status(200).json({message:"User is",payload:user});
    }catch(err){
        console.log(err);
    }
}


export const updateStudentCoreDetails = async (req, res) => {
   try {

      // only admin can update core details
      if (req.user.role !== "admin") {
         return res.status(403).json({
            message: "Access denied. Admin only"
         });
      }

      // fields that admin is allowed to update
      const allowedFields = [
   "name",
        "email",
       "rollNumber",
       "branch",
       "cgpa",
       "backlogs",
       "isPlaced"
      ];
      // create filtered object
      const updateData = {};

      allowedFields.forEach((field) => {
         if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
         }
      });

      const updatedStudent = await User.findByIdAndUpdate(

         req.params.id,

         updateData,

         {
            new: true,
            runValidators: true
         }

      ).select("-password");

      if (!updatedStudent) {
         return res.status(404).json({
            message: "Student not found"
         });
      }

      return res.status(200).json({
         message: "Student core details updated successfully",
         payload: updatedStudent
      });

   } catch (err) {

      return res.status(500).json({
         message: err.message
      });

   }
};

export const updateUser = async (req, res) => {

   try {
 
      // only student himself or admin
      if (
         req.user.role !== "admin" &&
         req.user._id !== req.params.id
      ) {
     

         return res.status(403).json({
            message: "Access denied"
         });

      }

      // editable fields for student
      const allowedFields = [
         "phone",
         "resumeUrl",
         "skills"
      ];

       if (req.user.role === "admin") {
         allowedFields = [
         ...allowedFields,
          "isActive",
         "isPlaced"
     ];
    }

      const updateData = {};

      allowedFields.forEach((field) => {
         if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
         }
      });

      const updatedUser = await User.findByIdAndUpdate(

         req.params.id,

         updateData,

         {
            new: true,
            runValidators: true
         }

      ).select("-password");

      if (!updatedUser) {

         return res.status(404).json({
            message: "User not found"
         });

      }

      return res.status(200).json({

         message: "Profile updated successfully",

         payload: updatedUser

      });

   } catch (err) {

      return res.status(500).json({
         message: err.message
      });

   }

};


// logout

export const logout = async(req,res)=>{

   res.clearCookie("token");

   return res.json({
      message:"Logged out"
   });
}

// upload resume
export const uploadResume = async (req, res) => {

   try {
      
      if (!req.file) {
         
         return res.status(400).json({
            message: "No file uploaded"
         });
         
      }
      console.log(req.file)

      const user = await User.findByIdAndUpdate(

         req.user._id,

         {
            resume: req.file.path,
            resumeType: req.file.mimetype,
            resumeName: req.file.originalname,
         },

         {
            new: true
         }

      ).select("-password");

      console.log("Resume URL:", user.resume);


      return res.status(200).json({

         message: "Resume uploaded",

         payload: user

      });

   } catch (err) {

      console.log(err);

      return res.status(500).json({
         message: err.message
      });

   }

};

export const downloadResume = async (req, res) => {
  
   const user = await User.findById(req.user._id);

   if (!user?.resume) {
      return res.status(404).json({
         message: "Resume not found"
      });
   }

   return res.redirect(user.resume);
};