import express from 'express';
import { getUserProfile, updateUserProfile, followUser, getCurrentUser,syncUser } from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

//public routes
router.get("/profile/:username", getUserProfile);

//protected routes
router.get("/sync", protectRoute, syncUser);
router.get("/me", protectRoute, getCurrentUser);
router.put("/update/:id", protectRoute, updateUserProfile);
router.post("/follow/:targetUserId", protectRoute, followUser);



export default router;