import express from "express";
import { cancelBooking, openBooking } from "../controllers/bookingCustomer.js";

const router = express.Router();

router.post("/new", openBooking);
router.delete("/:BID", cancelBooking);

export default router;
