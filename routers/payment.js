import express from "express";
import { makePayment, saveBooking, saveTeam } from "../controllers/payment.js";

const router = express.Router();

router.post("/", makePayment);
router.post("/validate", makePayment);
router.put("/team/:BID", saveTeam);
router.put("/booking/:BID", saveBooking);

export default router;
