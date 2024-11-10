import express from "express";
import { AdminRegister, AdminLogin, AdminLogout, getAdmin, deleteAdmin, updateAdmin, getAdminDetails } from "../../controllers/auth/admin.js";

const router = express.Router();
router.post("/register", AdminRegister);
router.post("/login", AdminLogin);
router.post("/logout", AdminLogout);
router.get('/', getAdmin);
router.get('/details/:id', getAdminDetails);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

export default router;
