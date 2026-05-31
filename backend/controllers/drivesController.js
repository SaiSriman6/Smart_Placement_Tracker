import { Drive } from "../models/Drives.js";
import { sendMail } from "../utils/sendMail.js";
import { User } from "../models/User.js"
import {Company} from "../models/Company.js"
import {Notification} from "../models/Notification.js";


// ==========================================
// CREATE DRIVE
// ==========================================
export const createDrive = async (req, res) => {
   try {

      // create drive
      const drive = await Drive.create(req.body);

      // get company details
      const company = await Company.findById(drive.company);
      console.log("Company:", drive.company);

      //find eligible students
      const eligibleStudents = await User.find({
         role: "student",
         cgpa: {
            $gte: company.eligibility.minCGPA
         }
      })

      // send mails
      for (const student of eligibleStudents) {

         //save notification
          await Notification.create({
             user:student._id,
             title:"New Placement Drive",
             message:`A new placement drive has been posted`
          });

      }

      return res.status(201).json({
         message: "Drive created successfully",
         payload: drive
      });

   } catch (err) {
      return res.status(500).json({
         message: err.message
      });
   }
};



// ==========================================
// GET ALL DRIVES
// ==========================================
export const getDrives = async (req, res) => {

   try {

      const drives = await Drive.find()
         .populate("company")
         .sort({ driveDate: 1 });

      return res.status(200).json({
         payload: drives
      });

   } catch (err) {

      return res.status(500).json({
         message: err.message   
      });
   }
};



// ==========================================
// GET DRIVE BY ID
// ==========================================
export const getDriveById = async (req, res) => {

   try {

      const drive = await Drive.findById(
         req.params.id
      ).populate("company");

      if (!drive) {
         return res.status(404).json({
            message: "Drive not found"
         });
      }

      return res.status(200).json({
         payload: drive
      });

   } catch (err) {

      return res.status(500).json({
         message: err.message
      });
   }
};



// ==========================================
// UPDATE DRIVE
// ==========================================
export const updateDrive = async (req, res) => {

   try {

      const updatedDrive =
         await Drive.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
               new: true
            }
         );

      if (!updatedDrive) {
         return res.status(404).json({
            message: "Drive not found"
         });
      }

      return res.status(200).json({
         message: "Drive updated",
         payload: updatedDrive
      });

   } catch (err) {

      return res.status(500).json({
         message: err.message
      });
   }
};



// ==========================================
// DELETE DRIVE
// ==========================================
export const deleteDrive = async (req, res) => {

   try {

      const deletedDrive =
         await Drive.findByIdAndDelete(
            req.params.id
         );

      if (!deletedDrive) {
         return res.status(404).json({
            message: "Drive not found"
         });
      }

      return res.status(200).json({
         message: "Drive deleted successfully"
      });

   } catch (err) {

      return res.status(500).json({
         message: err.message
      });
   }
};



// ==========================================
// UPDATE DRIVE STATUS
// ==========================================
export const updateDriveStatus =
async (req, res) => {

   try {

      const { status } = req.body;

      const updatedDrive =
         await Drive.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
         );

      if (!updatedDrive) {
         return res.status(404).json({
            message: "Drive not found"
         });
      }

      return res.status(200).json({
         message: "Drive status updated",
         payload: updatedDrive
      });

   } catch (err) {

      return res.status(500).json({
         message: err.message
      });
   }
};



// ==========================================
// ADD INTERVIEW ROUND
// ==========================================
export const addRound = async (req, res) => {

   try {

      const { roundNo, title, date } =
         req.body;

      const drive = await Drive.findById(
         req.params.id
      );

      if (!drive) {
         return res.status(404).json({
            message: "Drive not found"
         });
      }

      drive.rounds.push({
         roundNo,
         title,
         date
      });

      await drive.save();

      return res.status(200).json({
         message: "Round added",
         payload: drive
      });

   } catch (err) {

      return res.status(500).json({
         message: err.message
      });
   }
};



// ==========================================
// GET UPCOMING DRIVES
// ==========================================
export const getUpcomingDrives =
async (req, res) => {

   try {

      const drives = await Drive.find({
         status: "upcoming"
      }).populate("company");

      return res.status(200).json({
         payload: drives
      });

   } catch (err) {

      return res.status(500).json({
         message: err.message
      });
   }
};



// ==========================================
// GET COMPLETED DRIVES
// ==========================================
export const getCompletedDrives =
async (req, res) => {

   try {

      const drives = await Drive.find({
         status: "completed"
      }).populate("company");

      return res.status(200).json({
         payload: drives
      });

   } catch (err) {

      return res.status(500).json({
         message: err.message
      });
   }
};