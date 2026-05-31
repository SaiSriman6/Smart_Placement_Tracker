import { Application } from "../models/Application.js";
import { Drive } from "../models/Drives.js";
import { User } from "../models/User.js";
import { Notification } from "../models/Notification.js";



// ==========================================
// APPLY FOR DRIVE
// ==========================================
export const applyDrive = async (req, res) => {

   try {

      const { drive } = req.body;

      // check already applied
      const existingApplication =
         await Application.findOne({

            student: req.user._id,
            drive

         });

      if (existingApplication) {

         return res.status(400).json({
            message: "Already applied"
         });
      }

      // fetch student
      const user = await User.findById(
         req.user._id
      );

      if (!user.resume) {
       return res.status(400).json({
      message: "Please upload your resume before applying"
   });
   }

      // fetch drive + company
      const driveExists =
         await Drive.findById(drive)
         .populate("company");

      if (!driveExists) {

         return res.status(404).json({
            message: "Drive not found"
         });
      }

      // eligibility check
      if (
         user.cgpa <
         driveExists.company.eligibility.minCGPA
      ) {

         return res.status(400).json({
            message: "Not eligible due to CGPA"
         });
      }

      // create application
      const application =
         await Application.create({

            student: req.user._id,
            drive

         });

      return res.status(201).json({

         message: "Applied successfully",

         payload: application

      });

   } catch (err) {

      return res.status(500).json({
         message: err.message
      });
   }
};



// ==========================================
// GET ALL APPLICATIONS
// ==========================================
export const getApplications =
async (req, res) => {

   try {

      const applications =
         await Application.find()
         .populate("student")
         .populate({
            path:"drive",
            populate:{
               path:"company"
            }
         });

      return res.status(200).json({
         payload:applications
      });

   } catch (err) {

      return res.status(500).json({
         message:err.message
      });
   }
};



// ==========================================
// GET SINGLE APPLICATION
// ==========================================
export const getApplicationById =
async (req, res) => {

   try {

      const application =
         await Application.findById(
            req.params.id
         )
         .populate("student")
         .populate({
            path:"drive",
            populate:{
               path:"company"
            }
         });

      if (!application) {
         return res.status(404).json({
            message:"Application not found"
         });
      }

      return res.status(200).json({
         payload:application
      });

   } catch (err) {

      return res.status(500).json({
         message:err.message
      });
   }
};



// ==========================================
// GET MY APPLICATIONS
// ==========================================
export const getMyApplications =
async (req, res) => {

   try {

      const applications =
         await Application.find({
            student:req.user._id
         })
         .populate({
            path:"drive",
            populate:{
               path:"company"
            }
         });

      return res.status(200).json({
         payload:applications
      });

   } catch (err) {

      return res.status(500).json({
         message:err.message
      });
   }
};



// ==========================================
// UPDATE APPLICATION STATUS
// ==========================================
export const updateApplicationStatus =
async (req, res) => {

   try {

      const {
         status,
         currentRound
      } = req.body;

      const updatedApplication =
         await Application.findByIdAndUpdate(

            req.params.id,

            {
               status,
               currentRound
            },

            {
               new:true
            }

         );

      if (!updatedApplication) {
         return res.status(404).json({
            message:"Application not found"
         });
      }

      // Create notification for the student
      try {
         const populatedApp = await Application.findById(req.params.id).populate({
            path: 'drive',
            populate: { path: 'company' }
         });

         if (populatedApp) {
            const statusLabels = {
               applied: 'Applied',
               shortlisted: 'Shortlisted',
               round1: 'Moved to Technical Round',
               round2: 'Moved to Round 2',
               selected: 'Selected / Hired 🎉',
               rejected: 'Rejected'
            };
            const statusLabel = statusLabels[status] || status;
            const notifType = (status === 'selected' || status === 'rejected') ? 'RESULT' : 'INTERVIEW';

            await Notification.create({
               user: populatedApp.student,
               title: 'Application Status Update',
               message: `Your application for "${populatedApp.drive?.title || 'a drive'}" at ${populatedApp.drive?.company?.name || 'a company'} has been updated to: ${statusLabel}`,
               type: notifType,
               isRead: false
            });

            // If selected, update student to isPlaced: true
      if (status === 'selected') {
       await User.findByIdAndUpdate(
         populatedApp.student,
        {
           isPlaced: true
        }
      );

      } else {
         const hasSelectedApplications =
         await Application.exists({

          student: populatedApp.student,

          status: 'selected'

         });

        await User.findByIdAndUpdate(
        populatedApp.student,
       {
         isPlaced: !!hasSelectedApplications
       }
      );

   }
            
         }
      } catch (err) {
         console.error("Error creating notification:", err);
      }

      return res.status(200).json({
         message:"Application updated",
         payload:updatedApplication
      });

   } catch (err) {

      return res.status(500).json({
         message:err.message
      });
   }
};



// ==========================================
// DELETE APPLICATION
// ==========================================
export const deleteApplication =
async (req, res) => {

   try {

      const deletedApplication =
         await Application.findByIdAndDelete(
            req.params.id
         );

      if (!deletedApplication) {
         return res.status(404).json({
            message:"Application not found"
         });
      }

      return res.status(200).json({
         message:"Application deleted"
      });

   } catch (err) {

      return res.status(500).json({
         message:err.message
      });
   }
};