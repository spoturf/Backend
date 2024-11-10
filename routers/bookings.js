import express from 'express';
import { createBooking, getBookingsByCID, getBookingByBID, updateBooking, deleteBooking, getBookingByCIDTID, getBookingsByDate, getBookingByTID, updateStatus } from '../controllers/bookings.js';

const router = express.Router();

router.post('/', createBooking);                 // Create a new booking
router.get('/bookings/date/:date', getBookingsByDate);
router.get('/bookings/turf/:TID', getBookingByTID);
router.get('/customer/:CID', getBookingsByCID);  // Get all bookings by customer ID
router.get('/booking/:BID', getBookingByBID);            // Get a booking by booking ID
router.get('/turf/:CID/:TID', getBookingByCIDTID);           // Get a booking by booking ID
router.put('/all/:BID', updateBooking);              // Update a booking
router.put('/status/:BID', updateStatus);              // Update a booking
router.delete('/:BID', deleteBooking);           // Delete a booking

export default router;
