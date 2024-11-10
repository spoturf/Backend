import express from "express";
import { ClientLogin, ClientLogout, ClientRegister, deleteClient, getClient } from "../../controllers/auth/client.js";

const router = express.Router();
router.post("/register", ClientRegister);
router.post("/login", ClientLogin);
router.post("/logout", ClientLogout);
router.get("/list", getClient);
router.delete("/delete", deleteClient);

export default router;
