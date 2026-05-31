import { Notification } from "../models/Notification.js";

// Fetch notifications for the authenticated user
export const getNotifications = async (req, res) => {
   try {
      const userId = req.user._id;
      const notifications = await Notification.find({
         user: userId
      }).sort({ createdAt: -1 });

      return res.status(200).json({
         payload: notifications
      });
   } catch (err) {
      return res.status(500).json({
         message: err.message
      });
   }
};

// Mark a single notification as read
export const markAsRead = async (req, res) => {
   try {
      await Notification.findByIdAndUpdate(
         req.params.id,
         {
            isRead: true
         }
      );

      return res.status(200).json({
         message: "Notification marked as read"
      });
   } catch (err) {
      return res.status(500).json({
         message: err.message
      });
   }
};

// Mark all notifications as read for the authenticated user
export const markAllAsRead = async (req, res) => {
   try {
      const userId = req.user._id;
      await Notification.updateMany(
         { user: userId, isRead: false },
         { isRead: true }
      );

      return res.status(200).json({
         message: "All notifications marked as read"
      });
   } catch (err) {
      return res.status(500).json({
         message: err.message
      });
   }
};