import express from 'express';
import { getPosts, createPost, getPost, getUserPosts, likePost , deletePost } from '../controllers/post.controller.js';
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

//Public routes
router.get('/', getPosts);
router.get("/user/:username", getUserPosts);
router.get('/:postId', getPost);

//Protected routes
router.post('/', protectRoute, upload.single('image') , createPost);
router.post('/:postId/like', protectRoute, likePost);
router.delete('/:postId', protectRoute, deletePost);

export default router;