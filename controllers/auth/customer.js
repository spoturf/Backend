import { db } from "../../connect.js";
import jwt from "jsonwebtoken";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Function to generate a 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Helper function to generate OTP expiration time (5 minutes)
const generateOTPExpirationTime = () => {
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 5); // OTP expires in 5 minutes
  return expirationTime;
};

// Register Customer (Generate OTP and send via SMS)
export const CustomerRegister = (req, res) => {
  const q = "SELECT * FROM customers WHERE mobileNo=?";
  db.query(q, [req.body.mobileNo], (err, data) => {
    if (err) {
      console.error("Error querying customers:", err);
      return res.status(500).json(err);
    }
    if (data.length) return res.status(409).json("Customer already exists");

    const otp = generateOTP();
    const expiresAt = generateOTPExpirationTime();

    // Insert OTP into the 'otps' table with expiration time
    const insertOtpQuery =
      "INSERT INTO otps (mobileNo, otp, expiresAt) VALUES (?, ?, ?)";
    db.query(insertOtpQuery, [req.body.mobileNo, otp, expiresAt], (err) => {
      if (err) {
        console.error("Error inserting OTP:", err);
        return res.status(500).json("Failed to save OTP");
      }

      // Send OTP via Twilio
      client.messages
        .create({
          body: `Your OTP for registration is ${otp}`,
          from: process.env.TWILIO_FROM_NUMBER,
          to: req.body.mobileNo,
        })
        .then(() => {
          res.status(200).json("OTP sent successfully");
        })
        .catch((error) => {
          console.error("Error sending SMS:", error);
          res.status(500).json("Failed to send OTP");
        });
    });
  });
};

// Verify Register OTP (Check OTP validity and expiration)
export const VerifyRegisterOTP = (req, res) => {
  const { mobileNo, otp } = req.body;

  const q = "SELECT * FROM otps WHERE mobileNo=? AND otp=?";
  db.query(q, [mobileNo, otp], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0)
      return res.status(400).json("Invalid or expired OTP");

    const otpData = data[0];

    // Check if OTP has expired
    const expirationTime = new Date(otpData.expiresAt);
    if (new Date() > expirationTime) {
      return res.status(400).json("OTP has expired");
    }

    // Register the customer in the 'customers' table
    const insertCustomerQuery =
      "INSERT INTO customers (name, mobileNo, email, area, profilePic) VALUES (?)";
    const values = [
      req.body.name,
      req.body.mobileNo,
      req.body.email,
      req.body.area,
      req.body.profilePic,
    ];

    db.query(insertCustomerQuery, [values], (err) => {
      if (err) return res.status(500).json(err);

      // Delete OTP from the 'otps' table after successful registration
      const deleteOtpQuery = "DELETE FROM otps WHERE mobileNo=?";
      db.query(deleteOtpQuery, [mobileNo], (err) => {
        if (err) return res.status(500).json("Failed to clear OTP");
      });

      res.status(200).json("Customer registered successfully");
    });
  });
};

// Login Customer (Generate OTP for Login)
export const CustomerLogin = (req, res) => {
  const q = "SELECT * FROM customers WHERE mobileNo=?";
  db.query(q, [req.body.mobileNo], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Customer not found");

    const otp = generateOTP();
    const expiresAt = generateOTPExpirationTime();

    // Insert OTP into 'otps' table with expiration time
    const insertOtpQuery =
      "INSERT INTO otps (mobileNo, otp, expiresAt) VALUES (?, ?, ?)";

    db.query(insertOtpQuery, [req.body.mobileNo, otp, expiresAt], (err) => {
      if (err) return res.status(500).json("Failed to save OTP");

      // Send OTP via Twilio
      client.messages
        .create({
          body: `Your OTP for login is ${otp}`,
          from: process.env.TWILIO_FROM_NUMBER,
          to: req.body.mobileNo,
        })
        .then(() => {
          res.status(200).json("OTP sent successfully for login");
        })
        .catch((error) => {
          console.error("Error sending SMS:", error);
          res.status(500).json("Failed to send OTP for login");
        });
    });
  });
};

// Verify Login OTP (Check OTP validity and expiration)
export const VerifyLoginOTP = (req, res) => {
    const { mobileNo, otp } = req.body;
  
    const query =
      "SELECT * FROM otps WHERE mobileNo = ? ORDER BY createdAt DESC LIMIT 1";
    db.execute(query, [mobileNo], (err, results) => {
      if (err) return res.status(500).send("Error verifying OTP");
  
      const otpData = results[0];
      if (!otpData) return res.status(400).send("No OTP found for this mobile number");
  
      const expirationTime = new Date(otpData.expiresAt);
      if (new Date() > expirationTime) {
        return res.status(400).send("OTP has expired");
      }
  
      if (otpData.otp !== otp) {
        return res.status(400).send("Invalid OTP");
      }
  
      // OTP is valid, generate JWT token
      const payload = { mobileNo };
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
  
      // Retrieve customer details
      const customerQuery = "SELECT * FROM customers WHERE mobileNo = ?";
      db.execute(customerQuery, [mobileNo], (err, customerResults) => {
        if (err) return res.status(500).json(err);
  
        // Send token and customer details in the response
        res.status(200).json({ accessToken, details: customerResults[0] });
      });
    });
  };
  
// Customer Logout (Clear JWT token if implemented)
export const CustomerLogout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("Logged out");
};

// Get All Customers
export const getCustomer = (req, res) => {
  const q = "SELECT * FROM customers";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// Delete Customer
export const deleteCustomer = (req, res) => {
  const q = "SELECT * FROM customers WHERE `id`=?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (!data.length) return res.status(409).json("Customer not found");

    const deleteQuery = "DELETE FROM customers WHERE `id`=?";
    db.query(deleteQuery, [req.params.id], (err) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Customer deleted.");
    });
  });
};
