import express from "express";
import {
  signup,
  login,
  logout,
  protectRoute,
  getUserDetails,
  verifyOTP,
} from "../controllers/authController.js";
import passport from "passport";

const router = express.Router();

// Route for user signup
router.post("/signup", signup);

// Route for user login
router.post("/login", login);

// Route for verifying OTP
router.post("/verify-otp", verifyOTP);

// Route to initiate Google authentication
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Route for Google authentication callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL + "/auth?error=google_auth_failed",
    failureMessage: true,
  }),
  (req, res) => {
    // On successful authentication, generate a token and redirect to the homepage
    const token = req.user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.redirect(process.env.FRONTEND_URL + "/home");
  }
);

// Route for user logout
router.post("/logout", logout);

// Route to get user details (protected)
router.get("/me", protectRoute, getUserDetails);

export default router;