import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/google/url', AuthController.getGoogleUrl);
router.get('/google/callback', AuthController.handleGoogleCallback);
router.post('/demo', AuthController.loginDemo);
router.get('/me', authMiddleware, AuthController.getMe);
router.post('/logout', AuthController.logout);
router.post('/settings', authMiddleware, AuthController.updateSettings);

export default router;
