import Razorpay from "razorpay";
import { db } from "../connect.js";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

export const makePayment = async (req, res) => {
  try {
    const razorPay = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const options = {
      amount: req.body.amount * 100,
      currency: req.body.currency || "INR",
    };

    const order = await razorPay.orders.create(options);

    if (!order) return res.status(500).json("Error creating order");
    return res.status(200).json(order);
  } catch (err) {
    console.error("Error in makePayment:", err);
    return res.status(500).json("Error");
  }
};
export const saveTeam = (req, res) => {
  const { BID } = req.params;
  const { teamMembers } = req.body;

  const query = `
      UPDATE bookings 
      SET teamMembers=?
      WHERE BID = ?
    `;
  const values = [teamMembers, BID];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating booking:", err);
      return res.status(500).json({ message: "Error updating booking" });
    }

    return res.status(200).json({ message: "Booking updated successfully" });
  });
};
export const saveBooking = (req, res) => {
  const { BID } = req.params;
  const { payment } = req.body;

  const query = `
      UPDATE bookings 
      SET paymentStatus = ?,paymentMethod=?
      WHERE BID = ?
    `;
  const values = [payment, "Online", BID];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating booking:", err);
      return res.status(500).json({ message: "Error updating booking" });
    }

    return res.status(200).json({ message: "Booking updated successfully" });
  });
};

export const validatePayment = (req, res) => {
  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });
  const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  var {
    validatePaymentVerification,
    validateWebhookSignature,
  } = require("./dist/utils/razorpay-utils");
  validatePaymentVerification(
    { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
    signature,
    secret
  );
  console.log("Reached here");
};
