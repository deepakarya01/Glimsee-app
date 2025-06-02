import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
   type:String,
   required: true,
  },
  username:{
      type: String,
      required: true,
      unique: true,
  },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true,
   },
   profilePicture:{
      type: String,
   },
   bio:{
      type: String,
      default: "Hey there! I am using Glimsee app.",
   },
   location:{
      type: String,
      default: "Earth",
   },
   website:{
      type: String,
      default: "",
   },
   followers: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         default: [],
      },
   ],
   following: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         default: [],
      },
   ],
},
{timestamps: true}
)

const User = mongoose.model("User", userSchema);
export default User;