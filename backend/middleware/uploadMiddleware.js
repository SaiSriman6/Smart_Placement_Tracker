import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
   cloudinary,
   params: async (req, file) => ({
      folder: "resumes",
      resource_type: "raw",

      // KEEP THE ORIGINAL EXTENSION
      public_id: `${Date.now()}-${file.originalname}`
   })
});

export const upload = multer({
   storage,
   fileFilter: (req, file, cb) => {

      const allowedTypes = [
         "application/msword",
         "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];

      if (allowedTypes.includes(file.mimetype)) {
         cb(null, true);
      } else {
         cb(new Error("Only DOC and DOCX files are allowed"));
      }
   }
});