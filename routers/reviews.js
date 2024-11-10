import express from 'express';
import { addReview, deleteReview, getReviewsByTurf } from '../controllers/reviews.js';

const router = express.Router();

router.get('/:TID', getReviewsByTurf);
router.post('/', addReview);
router.delete('/:RID', deleteReview);

export default router;