import express from "express";

import {
   createDrive,
   getDrives,
   getDriveById,
   updateDrive,
   deleteDrive,
   updateDriveStatus,
   addRound,
   getUpcomingDrives,
   getCompletedDrives
} from "../controllers/drivesController.js";

import { verifyToken }
from "../middleware/verifyToken.js";

const router = express.Router();


// ==========================================
// STUDENT + ADMIN
// ==========================================

// get all drives
router.get(
   "/",
   verifyToken("student","admin"),
   getDrives
);


// get single drive
router.get(
   "/:id",
   verifyToken("student","admin"),
   getDriveById
);


// upcoming drives
router.get(
   "/upcoming/all",
   verifyToken("student","admin"),
   getUpcomingDrives
);


// completed drives
router.get(
   "/completed/all",
   verifyToken("student","admin"),
   getCompletedDrives
);



// ==========================================
// ADMIN ONLY
// ==========================================

// create drive
router.post(
   "/",
   verifyToken("admin"),
   createDrive
);


// update drive
router.put(
   "/:id",
   verifyToken("admin"),
   updateDrive
);


// delete drive
router.delete(
   "/:id",
   verifyToken("admin"),
   deleteDrive
);


// update drive status
router.put(
   "/:id/status",
   verifyToken("admin"),
   updateDriveStatus
);


// add interview rounds
router.put(
   "/:id/round",
   verifyToken("admin"),
   addRound
);

export default router;