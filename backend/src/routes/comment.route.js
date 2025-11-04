import express from 'express';
import { getCommentsByPost, createComment, deleteComment } from '../controllers/comment.controller.js';
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//Public routes
router.get('/post/:postId', getCommentsByPost);

//Protected routes
router.post('/', protectRoute, createComment);
router.delete('/:commentId', protectRoute, deleteComment);

export default router;