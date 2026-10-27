import express from 'express';
import { getMe, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/profile', getMe);
router.put('/profile', updateProfile);

export default router;
