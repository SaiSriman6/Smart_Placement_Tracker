import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { config } from "dotenv";

config();

export const register = async (userObj) => {

   const existingUser = await User.findOne({
      email: userObj.email
   });

   if (existingUser) {
      const err = new Error("Email already exists");
      err.status = 409;
      throw err;
   }

   // hash password
   userObj.password = await bcrypt.hash(
      userObj.password,
      10
   );

   // create user
   const user = await User.create(userObj);

   const newUser = user.toObject();

   delete newUser.password;

   return newUser;
};

export const authenticate = async ({ email, password }) => {

   // check user
   const user = await User.findOne({ email });

   if (!user) {
      const err = new Error("Invalid email");
      err.status = 401;
      throw err;
   }

   // compare passwords
   const isMatch = await bcrypt.compare(
      password,
      user.password
   );

   if (!isMatch) {
      const err = new Error("Invalid password");
      err.status = 401;
      throw err;
   }

   // blocked user check
   if (user.isActive === false) {
      const err = new Error(
         `${user.firstName} blocked by admin`
      );

      err.status = 403;

      throw err;
   }

   // generate token
   const token = jwt.sign(
      {
         _id: user._id,
         role: user.role,
         email: user.email
      },
      process.env.JWT_SECRET,
      {
         expiresIn: "1h"
      }
   );

   // remove password
   const userObj = user.toObject();

   delete userObj.password;

   return {
      token,
      user: userObj
   };
};