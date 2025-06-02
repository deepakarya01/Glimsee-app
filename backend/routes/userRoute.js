import express from 'express';
import { protectedRoute } from '../middleware/authMiddleware.js';
import { getUserProfile, updateUserProfile, followUnfollowUser, getFollowersList, getFollowingList } from '../controllers/userController.js';


const router = express.Router();


router.get('/profile/:username', protectedRoute, getUserProfile);

router.post('/update', protectedRoute, updateUserProfile);

router.post('/follow/:id', protectedRoute, followUnfollowUser);

router.get('/:username/followers', protectedRoute , getFollowersList)

router.get('/:username/following', protectedRoute, getFollowingList);

export default router;