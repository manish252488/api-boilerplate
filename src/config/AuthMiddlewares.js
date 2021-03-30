import passport from "passport";
import LocalStrategy from "passport-local";
import constants from "./constants";
import User from "../models/user.model";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

export async function verifyApiKey(req, res, next) {
  try {
    let api_key = req.headers["x-api-key"];
    if (req.headers["x-api-key"]) {
      if (api_key === constants.API_KEY) next();
      else return res.error("api key wrong!");
    } else {
      return res.error("api key missing in headers!");
    }
  } catch (err) {
    return res.error("error verifying api key", err);
  }
}

passport.use(
  "login",
  // eslint-disable-next-line no-undef
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // Find the user associated with the email provided by the user
        const user = await User.findOne({
          // eslint-disable-next-line object-shorthand
          email: email,
        });
        if (!user) {
          // If the user isn't found in the database, return a message
          return done(null, false, { message: "User not found" });
        }

        // If the passwords match, it returns a value of true.
        const validate = await user.authenticateUser(password);
        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }

        if (user.status === 0) {
          await User.findByIdAndUpdate(user.id, { status: 1 });
        }
        // Send the user information to the next middleware
        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "admin",
  new JwtStrategy(
    {
      secretOrKey: constants.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (!user) {
          return done(null, false, { message: "user not found/registered!" });
        }
        if (user.roleId !== 2) {
          return done(null, false, { message: "user is not an admin!" });
        }
        return done(null, user, { message: "user verified!" });
      } catch (err) {
        return done(error);
      }
    }
  )
);
passport.use(
  "checkJwt",
  new JwtStrategy(
    {
      secretOrKey: constants.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (!user) {
          return done(null, false, { message: "user not found/registered!" });
        }
        return done(null, user, { message: "user verified!" });
      } catch (err) {
        return done(error);
      }
    }
  )
);
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

export default passport;
