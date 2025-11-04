import express from 'express';
import { getNotifications, deleteNotifications } from '../controllers/notification.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/',protectRoute, getNotifications);
router.post('/:notificationId',protectRoute, deleteNotifications);

export default router;
