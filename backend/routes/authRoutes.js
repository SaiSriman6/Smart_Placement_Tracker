import express from "express";
import {signup,getUsers,getUserById,login,updateUser,logout,uploadResume,updateStudentCoreDetails,downloadResume} from "../controllers/authController.js"
import {verifyToken} from  "../middleware/verifyToken.js"
import { upload } from "../middleware/uploadMiddleware.js";

const router =express.Router();

router.post("/register",signup);

router.get("/user",verifyToken("admin"),getUsers)

router.get("/user/:id",verifyToken("admin"),getUserById);

router.post("/login",login)

router.put(
  "/upload-resume",
  (req, res, next) => {
    console.log("Route Hit");
    next();
  },
  verifyToken("student"),
  (req, res, next) => {
    console.log("Token Verified");
    next();
  },
  upload.single("resume"),
  (req, res, next) => {
    console.log("Multer Passed");
    next();
  },
  uploadResume
);

router.get(
   "/download-resume",
   verifyToken("student"),
   downloadResume
);


router.put(
   "/:id",
   verifyToken("student","admin"),
   updateUser
);

router.put(
   "/user/core/:id",
   verifyToken("admin"),
   updateStudentCoreDetails
);


router.post("/logout",logout)

export default router;