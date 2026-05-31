import express from "express";

import {
   applyDrive,
   getApplications,
   getApplicationById,
   updateApplicationStatus,
   deleteApplication,
   getMyApplications
} from "../controllers/applicationController.js";

import { verifyToken }
from "../middleware/verifyToken.js";

const router = express.Router();


// ==========================================
// STUDENT
// ==========================================

// apply for drive
router.post(
   "/",
   verifyToken("student"),
   applyDrive
);


// logged-in student applications
router.get(
   "/my-applications",
   verifyToken("student"),
   getMyApplications
);



// ==========================================
// ADMIN
// ==========================================

// get all applications
router.get(
   "/",
   verifyToken("admin"),
   getApplications
);


// get single application
router.get(
   "/:id",
   verifyToken("admin"),
   getApplicationById
);


// update round/status
router.put(
   "/:id/status",
   verifyToken("admin"),
   updateApplicationStatus
);


// delete application
router.delete(
   "/:id",
   verifyToken("admin"),
   deleteApplication
);

export default router;