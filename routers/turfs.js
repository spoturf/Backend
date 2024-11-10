import express from 'express';
import { createTurf, getTurfs, getTurfByTID, updateTurf, deleteTurf, updateStatus, updateClient } from '../controllers/turfs.js';

const router = express.Router();

router.post('/', createTurf);           // Create a new turf
router.get('/', getTurfs);               // Get all turfs
router.get('/:TID', getTurfByTID);      // Get turf by TID
router.put('/full/:TID', updateTurf);        // Update a turf
router.put('/status/:TID', updateStatus);        // Update a turf
router.put('/owner/:TID', updateClient);        // Update a turf
router.delete('/:TID', deleteTurf);     // Delete a turf

export default router;
