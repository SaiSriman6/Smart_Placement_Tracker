import express from 'express';
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notificationController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Get all notifications for the authenticated user
router.get(
   "/",
   verifyToken("student", "admin"),
   getNotifications
);

// Mark all notifications as read for the authenticated user (must be before :id to prevent matching as ID)
router.put(
   "/mark-all-read",
   verifyToken("student", "admin"),
   markAllAsRead
);

// Mark a specific notification as read
router.put(
   "/:id",
   verifyToken("student", "admin"),
   markAsRead
);

export default router;