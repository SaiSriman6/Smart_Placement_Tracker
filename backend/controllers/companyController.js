import { Company } from "../models/Company.js";

// Create Company
export const createCompany = async (req, res) => {

   try {

      const company = await Company.create(req.body);

      return res.status(201).json({
         message: "Company created successfully",
         payload: company
      });

   } catch (err) {

      return res.status(500).json({
         message: err.message
      });
   }
};

// Get All Companies
export const getCompanies = async (req, res) => {

   try {

      const companies = await Company.find()
         .sort({ createdAt: -1 });

      return res.status(200).json({
         message: "Companies fetched",
         payload: companies
      });

   } catch (err) {

      return res.status(500).json({
         message: err.message
      });
   }
};

// Get Company By ID
export const getCompanyById = async (req, res) => {

   try {

      const company = await Company.findById(
         req.params.id
      );

      if (!company) {
         return res.status(404).json({
            message: "Company not found"
         });
      }

      return res.status(200).json({
         payload: company
      });

   } catch (err) {

      return res.status(500).json({
         message: err.message
      });
   }
};

// Update Company
export const updateCompany = async (req, res) => {

   try {

      const updatedCompany =
         await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
               new: true
            }
         );

      if (!updatedCompany) {
         return res.status(404).json({
            message: "Company not found"
         });
      }

      return res.status(200).json({
         message: "Company updated",
         payload: updatedCompany
      });

   } catch (err) {

      return res.status(500).json({
         message: err.message
      });
   }
};

// Delete Company
export const deleteCompany = async (req, res) => {

   try {

      const deletedCompany =
         await Company.findByIdAndDelete(
            req.params.id
         );

      if (!deletedCompany) {
         return res.status(404).json({
            message: "Company not found"
         });
      }

      return res.status(200).json({
         message: "Company deleted"
      });

   } catch (err) {

      return res.status(500).json({
         message: err.message
      });
   }
};

// Search Company
export const searchCompany = async (req, res) => {

   try {

      const keyword = req.query.keyword;

      const companies = await Company.find({
         name: {
            $regex: keyword,
            $options: "i"
         }
      });

      return res.status(200).json({
         payload: companies
      });

   } catch (err) {

      return res.status(500).json({
         message: err.message
      });
   }
};

// Filter Companies by Package
export const filterCompaniesByPackage =
async (req, res) => {

   try {

      const minPackage = req.query.package;

      const companies = await Company.find({
         package: {
            $gte: minPackage
         }
      });

      return res.status(200).json({
         payload: companies
      });

   } catch (err) {

      return res.status(500).json({
         message: err.message
      });
   }
};

//  Get Upcoming Companies
export const getUpcomingCompanies =
async (req, res) => {

   try {

      const today = new Date();

      const companies = await Company.find({
         driveDate: {
            $gte: today
         }
      });

      return res.status(200).json({
         payload: companies
      });

   } catch (err) {

      return res.status(500).json({
         message: err.message
      });
   }
};