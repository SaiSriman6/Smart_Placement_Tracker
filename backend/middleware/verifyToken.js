import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const verifyToken = (...allowedRoles) => {

   return async (req, res, next) => {

      try {

         // read token
         const token = req.cookies.token;

         if (!token) {
            return res.status(401).json({
               message: "Unauthorized request. Please login"
            });
         }

         // verify token
         const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
         );

         // role authorization
         if (
            allowedRoles.length > 0 &&
            !allowedRoles.includes(decodedToken.role)
         ) {
            return res.status(403).json({
               message: "Forbidden. Access denied"
            });
         }

         // attach user
         req.user = decodedToken;

         next();

      } catch (err) {

         if (err.name === "TokenExpiredError") {
            return res.status(401).json({
               message: "Session expired"
            });
         }

         if (err.name === "JsonWebTokenError") {
            return res.status(401).json({
               message: "Invalid token. Please login again"
            });
         }

         return res.status(500).json({
            message: "Server Error"
         });
      }
   };
};