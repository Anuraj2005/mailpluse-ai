import { Router } from 'express';
import { AIController } from '../controllers/aiController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/summarize', AIController.summarize);
router.post('/generate-reply', AIController.generateReply);
router.post('/explain', AIController.explain);
router.post('/extract-insights', AIController.extractInsights);

export default router;
