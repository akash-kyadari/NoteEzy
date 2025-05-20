import express from "express";
import {
  signup,
  login,
  logout,
  protectRoute,
  getUserDetails,
} from "../controllers/authController.js";
const router = express.Router();

// ✅ Signup with Cookie
router.post("/signup", signup);

// ✅ Login with Cookie
router.post("/login", login);

// ✅ Logout — Clear Cookie
router.post("/logout", logout);

router.get("/me", protectRoute, getUserDetails);

export default router;
