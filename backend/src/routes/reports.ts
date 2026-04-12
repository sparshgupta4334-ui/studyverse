import { Router } from 'express';
import { getStats, generateReport } from '../controllers/reportController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/stats', getStats);
router.get('/generate', generateReport);

export default router;
