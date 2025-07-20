import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { IUser, Role } from "../modules/user/user.interface";
import bcryptjs from "bcryptjs";

// Local strategy for username and password authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done("User not found");
        }
        const isGoogleAuth = user.auths.some(
          (auth) => auth.provider === "google"
        );
        if (isGoogleAuth && !user.password) {
          return done(
            "This user has logged in with Google. Please use Google login."
          );
        }
        const isPasswordValid = await bcryptjs.compare(
          password,
          user.password || ""
        );
        if (!isPasswordValid) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Google OAuth strategy for authentication
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(
            new Error("Email not found in Google profile"),
            undefined
          );
        }
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create<IUser>({
            email,
            name: profile.displayName,
            isVerified: true,
            role: Role.USER,
            picture: profile.photos?.[0]?.value,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
          await user.save();
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: string) => void) => {
  const userId = user._id;
  done(null, userId);
});
passport.deserializeUser(
  async (
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    done: (err: any | null, user?: Express.User | false | null) => void
  ) => {
    try {
      const user = await User.findById(id).lean();
      if (!user) {
        return done(null, false); // No user found
      }
      done(null, user as Express.User);
    } catch (error) {
      done(error);
    }
  }
);
