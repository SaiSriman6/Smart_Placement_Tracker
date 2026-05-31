import express from "express";

import {
   createCompany,
   getCompanies,
   getCompanyById,
   updateCompany,
   deleteCompany
} from "../controllers/companyController.js";

import { verifyToken }
from "../middleware/verifyToken.js";

const router = express.Router();


// student + admin can view
router.get(
   "/",
   verifyToken("student","admin"),
   getCompanies
);


// student + admin can view single company
router.get(
   "/:id",
   verifyToken("student","admin"),
   getCompanyById
);


// admin only
router.post(
   "/",
   verifyToken("admin"),
   createCompany
);


// admin only
router.put(
   "/:id",
   verifyToken("admin"),
   updateCompany
);


// admin only
router.delete(
   "/:id",
   verifyToken("admin"),
   deleteCompany
);

export default router;