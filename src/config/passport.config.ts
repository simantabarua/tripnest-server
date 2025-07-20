import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { IUser, Role } from "../modules/user/user.interface";

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
