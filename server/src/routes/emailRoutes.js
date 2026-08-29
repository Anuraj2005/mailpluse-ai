import { Router } from 'express';
import { EmailController } from '../controllers/emailController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Apply auth middleware to all email routes
router.use(authMiddleware);

router.get('/', EmailController.listEmails);
router.get('/:threadId', EmailController.getThread);
router.patch('/:messageId/modify', EmailController.modifyEmail);
router.post('/send', EmailController.sendEmail);

export default router;
