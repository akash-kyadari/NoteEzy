import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construct the path to the .env file in the parent directory (backend)
const envPath = path.resolve(__dirname, "../.env");

// Load the environment variables from the specified path
dotenv.config({ path: envPath });

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import User from "../models/userModel.js";

// Verify that the environment variables are loaded
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error(
    "FATAL: GOOGLE_CLIENT_ID is not defined in the environment variables. Please check your .env file and the path in passport.js."
  );
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.BACKEND_URL + "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email: email });

        if (user) {
          if (user.googleId) {
            if (user.googleId === profile.id) {
              return done(null, user);
            } else {
              return done(null, false, {
                message:
                  "This email is already registered with a different Google account.",
              });
            }
          } else {
            return done(null, false, {
              message:
                "This email is already registered with email and password. Please log in using your email and password.",
            });
          }
        } else {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: email,
            avatar: profile.photos[0].value,
          });
          await user.save();
          return done(null, user);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
