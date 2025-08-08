import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Function to generate a JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Set cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "None",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

// Controller for user signup
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input fields
  if (!email || !password || !name) {
    return res.status(400).json({ msg: "All fields are required." });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ msg: "Invalid email format." });
  }

  if (password.length < 6) {
    return res.status(400).json({ msg: "Password must be at least 6 characters." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.googleId) {
        return res.status(400).json({ msg: "This email is already registered with Google. Please log in with Google." });
      } else {
        return res.status(400).json({ msg: "This email is already registered. Please log in." });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser._id);
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    res
      .cookie("token", token, cookieOptions)
      .status(201)
      .json({ userId: newUser._id, user: userWithoutPassword });
  } catch (err) {
    console.error("Error in signup route: ", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Controller for user login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email }).populate({
      path: "rooms",
      select: "name description aid createdBy",
      populate: {
        path: "createdBy",
        select: "name email",
      },
    });

    if (!user) {
      return res.status(400).json({ msg: "No user found with this email." });
    }

    if (user.googleId && !user.password) {
      return res.status(400).json({ msg: "You have previously logged in with Google. Please use Google to log in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password." });
    }

    const token = generateToken(user._id);
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.cookie("token", token, cookieOptions).status(200).json({ user: userWithoutPassword });
  } catch (err) {
    console.error("Error in login route: ", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Controller for user logout
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });
  res.status(200).json({ msg: "Logged out" });
};

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ msg: "Not authorized. No token found." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Token verification failed: ", err.message);
    res.status(401).json({ msg: "Invalid or expired token." });
  }
};

// Controller to get user details
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate({
        path: "rooms",
        select: "name description aid createdBy",
        populate: {
          path: "createdBy",
          select: "name email",
        },
      });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Profile fetch error: ", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};