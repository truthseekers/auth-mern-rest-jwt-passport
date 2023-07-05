import passport from "passport";
import { Strategy as JWTstrategy } from "passport-jwt"; // is this right?
import { ExtractJwt } from "passport-jwt";
import { User } from "./models/User.mjs";
import bcrypt from "bcrypt";
// import localStrategy from "passport-local"
import { Strategy as localStrategy } from "passport-local";

const passportLocalStrategy = () => {
  return passport.use(
    "login",
    new localStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        console.log("in localStrategy login...");
        // done(null, userObject, { message: "Optional success/fail message"});
        // done(err) // Application Error
        // done(null, false, {message: "Unauthorized login credentials!"}) // User input error when 2nd param is false

        try {
          if (email === "apperror") {
            throw new Error(
              "Oh no! The application crashed! We have reported the issue. You can change next(error) to next(error.message) to hide the stack trace"
            );
          }
          // const user = await User.findOne((user) => user.email === email);
          const user = await User.findOne({ email: email.toLowerCase() });
          console.log("user found: ", user);
          // const user = {
          //   email: "fastpenguin91@gmail.com",
          //   password: "password",
          // };
          if (!user) {
            return done(null, false, { message: "User not found!" });
          }

          const passwordMatches = await bcrypt.compare(password, user.password);
          if (!passwordMatches) {
            return done(null, false, { message: "Invalid credentials" });
          }

          return done(null, user, {
            message: "Hey congrats you are logged in!",
          });
        } catch (error) {
          return done(error); // application error!
        }
      }
    )
  );
};

const jwtStrategy = () => {
  return passport.use(
    new JWTstrategy(
      {
        secretOrKey: process.env.ACCESS_TOKEN_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //getJwt,
      },
      async (token, done) => {
        console.log("hello????");
        if (token?.user?.email == "tokenerror") {
          let testError = new Error(
            "something bad happened. we've simulated an application error in the JWTstrategy callback for users with an email of 'tokenerror'."
          );
          return done(testError, false);
        }

        if (token?.user?.email == "emptytoken") {
          // 2. Some other reason for user to not exist. pass false as user:
          // displays "unauthorized". Doesn't allow the app to hit the next function in the chain.
          // We are simulating an empty user / no user coming from the JWT.
          return done(null, false); // unauthorized
        }

        // 3. Successfully decoded and validated user:
        // (adds the req.user, req.login, etc... properties to req. Then calls the next function in the chain.)
        // console.log("token in jwt strat: ", token);
        return done(null, token.user);
      }
    )
  );
};
export { jwtStrategy, passportLocalStrategy };
