import {v2 as cloudinary} from 'cloudinary';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import Notification from '../models/notificationModel.js';



export const createPost = async (req, res) => {
   try {
      let {text} = req.body;
      let imageUrl = null;

      if(req.file){
         const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {folder: "posts"});
         imageUrl = uploadedResponse.secure_url;
      }


      const userId = req.user._id.toString();
      const user = await User.findById(userId);
      if(!user) return res.status(404).json({message: "User not found!"})

      if(!text && !imageUrl) return res.status(400).json({message: "Post must have either one image or text."})

      const newPost = new Post({
         author: userId,
         text,
         image: imageUrl,
      })

      await newPost.save();

      const populatedPost = await Post.findById(newPost._id)
         .populate('author', 'username name profilePicture')

      res.status(201).json(populatedPost);

   } catch (error) {
      res.status(500).json({ error: "Internal server error" });
		console.log("Error in createPost controller: ", error);
   }
}

export const getAllPosts = async (req, res) => {
   try {
      const posts = await Post.find()
         .sort({createdAt: -1})
         .populate({path: 'author', select: '-password'})
         .populate({path: 'comments.user', select: '-password'})
      
      if(posts.length === 0){
         return res.status(200).json([])
      }

      res.status(200).json(posts);
   } catch (error) {
      console.log("Error in getAllPosts controller", error);
      res.status(500).json({error: "Internal server error"});
   }
}

export const getFollowingPosts = async (req, res) => {
   const userId = req.user._id
   const user = await User.findById(userId)

   if(!user) return res.status(404).json({message: "User not found!"})

   const following = user.following;

   const feedPosts = await Post.find({user: {$in: following}})
      .sort({createdAt: -1})
      .populate({path: 'user', select: '-password'})
      .populate({path: 'comments.user', select: '-password'})

   res.status(200).json(feedPosts);
}

export const deletePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if(!post){
         return res.status(400).json({message: "Post not found"})
      }

      if(post.author.toString() !== req.user._id.toString()){
         return res.status(401).json({message: "Unauthorized, You can not delete this post."})
      }

      // if(post.img){
      //    const imgId = post.img.split("/").pop().split(".")[0]
      //    await cloudinary.uploader.destroy(imgId);
      // }

      await Post.findByIdAndDelete(req.params.id);

      res.status(200).json({message: "Post deleted successfully!"})

   } catch (error) {
      console.log("Error in deletePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
   }
}

export const likeUnlikePost = async (req, res) => {
   try {
      const userId = req.user._id;
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if(!post){
         return res.status(404).json({message: "Post not found!"})
      }

      const hasPost = post.likes.includes(userId);

      if(hasPost){
         //Unlike the post
         await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
         await User.findByIdAndUpdate(userId, { $pull: { likes: postId } });
      } else {
         //Like the post
         await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
         await User.findByIdAndUpdate(userId, { $push: { likes: postId } });

         //Create notification
         if(post.author.toString() !== userId.toString()){
            await Notification.create({
               from: userId,
               to: post.author,
               type: "like",
            })
         }

         res.status(200).json({message: "Post liked."})
      }
   } catch (error) {
      console.log("Error in likeUnlikePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
   }
}

export const commentOnPost = async (req, res) => {
   try {
      const {text} = req.body;
      const userId = req.user._id;
      const postId = req.params.id;

      if(!text || text.trim() === ""){
         return res.status(400).json({message: "Text field is required."})
      }

      const post = await Post.findById(postId);
      if(!post){
         return res.status(404).json({message: "Post not found!"})
      }

      const comment = {
         user: userId,
         text,
         createdAt: new Date(),
      }

      post.comments.unshift(comment);
      await post.save();

      //Create notification
      if(post.author.toString() !== userId.toString()){
         await Notification.create({
            from: userId,
            to: post.author,
            type: "comment",
         })
      }

      res.status(200).json({message: "Comment added successfully!"})
   } catch (error) {
      console.log("Error in commentOnPost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
   }
}

export const getUserPosts = async (req, res) => {
   try {
      const {username} = req.params;

      const user = await User.findOne({username});
      if(!user) return res.status(404).json({message: "User not found!"})

      const posts = await Post.find({author: user._id})
         .sort({createdAt: -1})
         .populate({path: 'author', select: '-password'})
         .populate({path: 'comments.user', select: '-password'})

      res.status(200).json(posts);
   } catch (error) {
      console.log("Error in getUserPosts controller: ", error);
      res.status(500).json({ error: "Internal server error" });
   }
}


export const getPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId)
            .populate('author', 'username name profilePicture')
            .populate({
                path: 'comments.user',
                select: 'username name profilePicture'
            });

        if (!post) {
            return res.status(404).json({ message: "Post not found!" });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error("Error in getPost:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};