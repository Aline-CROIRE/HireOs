import { Router } from 'express';
import { uploadCandidates, triggerScreening, getCandidates, updateStatus } from '../controllers/CandidateController';
import { getTalentInsights } from '../controllers/InsightController';

const router = Router();
router.get('/', getCandidates);
router.post('/upload', uploadCandidates);
router.post('/screen', triggerScreening);
router.patch('/:id/status', updateStatus);
router.get('/insights', getTalentInsights);

export default router;