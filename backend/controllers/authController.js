import { generateToken } from "../lib/generateToken.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
   const { name, email, password,username } = req.body;
   try {
      if (!name || !email || !password || !username) {
         return res.status(400).json({ message: "All fields are mandatory." });
      }

      const existingUser = await User.findOne({email})
      if(existingUser) {
         return res.status(400).json({ message: "User already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
         name,
         email,
         password: hashedPassword,
         username,
      });

      generateToken(newUser, res);

      res.status(201).json({
         message: "User created successfully.",
         user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            username: newUser.username,
         }
      });

   } catch (error) {
      console.error("Signup error:",error);
      res.status(500).json({ message: "Internal server error." });
   }
}

export const login = async (req, res) => {
   const { email, password } = req.body;
   try {
      if (!email || !password) {
         return res.status(400).json({ message: "All fields are mandatory." });
      }

      const user = await User.findOne({ email });
      if (!user) {
         return res.status(401).json({ message: "Invalid credentials." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         return res.status(401).json({ message: "Invalid credentials." });
      }

      generateToken(user, res);

      res.status(200).json({
         message: "Login successful.",
         user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            username: user.username,
            bio: user.bio,
            location: user.location,
            website: user.website,
            followers: user.followers,
            following: user.following,
         }
      });

   } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error." });
   }
}


export const logout = async (req, res) => {
   try {
      res.cookie("jwt", "", {
         httpOnly: true,
         secure: process.env.NODE_ENV !== "development",
         sameSite: "strict",
         maxAge: 0,
      });

      res.status(200).json({ message: "Logout successful." });
   } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Internal server error." });
   }
}

export const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.json({ user: req.user });
}

