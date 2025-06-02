import {v2 as cloudinary} from 'cloudinary';
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";

export const getUserProfile = async (req, res) => {
   const username = req.params.username;

   try {
      const user = await User.findOne({username}).select("-password")
      if(!user) return res.status(404).json({ message: "User not found" });

		res.status(200).json(user);
   } catch (error) {
      console.log("Error in getUserProfile: ", error.message);
		res.status(500).json({ error: error.message });
   }
}

export const followUnfollowUser = async (req, res) => {
   try {
      const {id} = req.params;
      const userToModify = await User.findById(id)
      const currentUser = await User.findById(req.user._id)

      if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

      if (id === req.user._id.toString()) {
			return res.status(400).json({ error: "You can't follow/unfollow yourself" });
		}

      const isFollowing = currentUser.following.includes(id);

      if(isFollowing){
         //Unfollow user
         await User.findByIdAndUpdate(id,{$pull: {followers: req.user._id}})
         await User.findByIdAndUpdate(req.user._id, {$pull: {following:id}})

         res.status(200).json({message: "User unfollowed successfully"})
      } else {
         //follow user
         await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}})
         await User.findByIdAndUpdate(req.user._id, { $push: {following:id}})

         //Create notification
         await Notification.create({
            from: req.user._id,
            to:id,
            type: "follow",
         })
         
         res.status(200).json({message: "User followed successfully"})
      } 


   } catch (error) {
      console.error("Error in followUnfollowUser: ", error.message);
		res.status(500).json({ error: error.message });
   }
   
}

export const updateUserProfile = async (req, res) => {
   const {name, email, username, bio, location, website} = req.body;
   let {profilePicture} = req.body;

   const userId = req.user._id

   try {
      let user = await User.findById(userId)
      if(!user)  return res.status(404).json({ message: "User not found" });

      if(email && email !== user.email){
         const existingEmailUser = await User.findOne({email})
         if(existingEmailUser){
            return res.status(400).json({message: "Email already registered"})
         }
      }

      if(username && username !== user.username){
         const existingUsernameUser = await User.findOne({username})
         if(existingUsernameUser){
            return res.status(400).json({message: "Username already taken"})
         }
      }

      if(profilePicture){
         const uploadedResponse = await cloudinary.uploader.upload(profilePicture, {folder: "profile_pictures"});
         profilePicture = uploadedResponse.secure_url;
      }

      if(name) user.name = name;
      if(email) user.email = email;
      if(username) user.username = username;
      if(bio) user.bio = bio;
      if(website) user.website = website;
      if(location) user.location = location;
      if(profilePicture) user.profilePicture = profilePicture;

      await user.save()

      res.status(200).json({
         message: "profile updated successfully",
         user: {
            _id: user._id,
            name:user.name,
            email:user.email,
            username:user.username,
            bio:user.bio,
            website:user.website,
            location:user.location,
            profilePicture:user.profilePicture,
         }
      });
   } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}

export const getFollowersList = async (req, res) => {
   try {
      const {username} = req.params;

      const user = await User.findOne({username})

      if(!user) return res.status(404).json({ message: "User not found" });

      const followers = await User.findById(user._id)
         .populate('followers', 'name username profilePicture')
         .select('followers -_id')

      res.status(200).json(followers.followers);
   } catch (error) {
      console.error("Error in getFollwersList: ", error.message);
      res.status(500).json({ error: error.message });
   }
}

export const getFollowingList = async (req, res) => {
   try {
      const {username} = req.params;
      const user = await User.findOne({username})

      if(!user) return res.status(404).json({ message: "User not found" });

      const following = await User.findById(user._id)
         .populate('following', 'name username profilePicture')
         .select('following -_id')
      
      res.status(200).json(following.following);

   } catch (error) {
      console.error("Error in getFollowingList: ", error.message);
      res.status(500).json({ error: error.message });
   }
}