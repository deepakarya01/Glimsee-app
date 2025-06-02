import express from 'express';
import multer from 'multer';
import { createPost, deletePost, getAllPosts, getFollowingPosts, likeUnlikePost, commentOnPost, getUserPosts, getPost  } from '../controllers/postController.js';
import { protectedRoute } from "../middleware/authMiddleware.js";
const router = express.Router();

const upload = multer({dest: 'temp-uploads/'});

//Create post
router.post('/', protectedRoute, upload.single('img'), createPost)

//Get all posts
router.get('/all',protectedRoute, getAllPosts) 

//Get following posts
router.get('/following', protectedRoute, getFollowingPosts);

//Get single post
router.get('/:id', protectedRoute, getPost);

//Delete post
router.delete('/:id', protectedRoute, deletePost)

//Like posts
router.post('/like/:id', protectedRoute, likeUnlikePost)

//Comment posts
router.post('/comment/:id', protectedRoute, commentOnPost)

//Get User post
router.get('/user/:username', protectedRoute, getUserPosts)


export default router;