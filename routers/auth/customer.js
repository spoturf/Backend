import express from "express";
import {
    CustomerRegister,
    VerifyRegisterOTP,
    CustomerLogin,
    VerifyLoginOTP,
    CustomerLogout,
    getCustomer,
    deleteCustomer
} from "../../controllers/auth/customer.js";

const router = express.Router();

router.post("/register", CustomerRegister);
router.post("/verify-register-otp", VerifyRegisterOTP);
router.post("/login", CustomerLogin);
router.post("/verify-login-otp", VerifyLoginOTP);
router.post("/logout", CustomerLogout);
router.get("/", getCustomer);
router.delete("/:id", deleteCustomer);

export default router;
