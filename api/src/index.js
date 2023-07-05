import express from "express";
import cors from "cors";
const app = express();
const port = 3001;
import products from "./products.json" assert { type: "json" };
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { jwtStrategy, passportLocalStrategy } from "./strategies.mjs";
import { User } from "./models/User.mjs";
import jwt from "jsonwebtoken";

try {
  mongoose.connect(
    `mongodb+srv://john:${process.env.MONGO_PASS}@music-app.wixv4kc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
    }
  );
  console.log("connected to mongodb");
} catch (err) {
  console.log("err connecting to mongo: ", err);
}

passportLocalStrategy();
jwtStrategy();

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

app.get("/products", async (req, res) => {
  return res.json(products);
});

app.get("/product/:productId", (req, res) => {
  console.log("req.body in /product: ", req.body);
  console.log("req.params: ", req.params);

  const result = products.find((product) => req.params.productId == product.id);

  return res.json(result);
});

app.get("/users", async (req, res) => {
  let query = {};
  const users = await User.find(query);
  console.log("users in rest server: ", users);
  return res.json(users);
});

app.get("/user/:userId", async (req, res) => {
  console.log("req.body in /user/:userId: ", req.body);
  console.log("req.params: ", req.params);

  const user = await User.findById(req.params.userId);

  console.log("user to return: ", user);
  // const user = products.find((product) => req.params.productId == product.id);

  return res.json(user);
});

app.get("/currentuser", (req, res) => {
  console.log("currentUser route");
  // passport.authenticate("jwt", { session: false }, function (err, user, info) {
  //   console.log("user: ", user);
  //  });

  console.log("1 currentUser");

  const accessToken = req.headers["authorization"].split("Bearer ")[1];
  console.log("2 currentUser");

  try {
    console.log("3 currentUser");
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log("4 currentUser payload: ", payload);

    const user = {
      _id: payload.user?._id,
      email: payload.user?.email,
    };

    console.log("sending the user back to ui: ", user);
    return res.send(user);
  } catch (err) {
    res.statusCode = 401;
    return res.send("Unauthorized");
  }

  return res.json("Bro does it work?");
});

app.post("/logout", (req, res) => {
  return res.send("Bro does it work?");
});

app.post(
  "/login",
  function (req, res, next) {
    // console.log("login body: ", req.body);
    // return res.json("ugh");
    passport.authenticate("login", async (err, user, info) => {
      console.log("found the user?");
      // console.log("err: ", err);
      // console.log("user: ", user);
      // console.log("info: ", info);
      if (err) {
        console.log("there was an err: ", err);
        return next(err);
      }
      console.log("2. past err");
      if (!user) {
        // I don't think this is right. Should let the front end handle the redirecting.
        console.log("3. no user");
        return res.redirect(`/failed?message=${info.message}`);
      }
      console.log("4. creating body");

      const body = { _id: user._id, email: user.email };
      console.log("5. creating accessToken");
      const accessToken = jwt.sign(
        { user: body },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "30s",
        }
      );
      console.log("5. creating refreshToken");

      // might want to make the refreshtoken look more like the accessToken with the ID and email, or just the id.
      const refreshToken = await jwt.sign(
        { email: user.email },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1m",
        }
      );

      console.log("6. user.refreshToken");
      user.refreshToken = refreshToken;
      console.log("7. saving user");
      await user.save();

      console.log("8. returning stuff");
      return res
        .status(200)
        .json({ user, accessToken, refreshToken, error: "" });
    })(req, res, next);
  },
  (req, res, next) => {
    res.send("Hello"); // able to add functions after the authenticate call now.
  }
);

// app.post("/login", (req, res) => {
//   return res.json("Bro does it work?");
// });

app.post("/token", async (req, res) => {
  const refreshToken = req.headers["authorization"].split("Bearer ")[1];

  try {
    console.log("1 token");

    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log("2 token");

    const { email } = payload;
    console.log("3 token. email from payload: ", email);

    const theUser = await User.findOne({ email });
    console.log("4 token. theUser from db: ", theUser);

    const refreshTokensMatch = theUser.refreshToken == refreshToken;
    console.log("5. refreshTokensMatch: ", refreshTokensMatch);

    const body = { _id: theUser._id, email: theUser.email };

    console.log("6 token. body: ", body);

    if (refreshTokensMatch) {
      console.log("7 token. refreshTokensMatch true");
      const accessToken = await jwt.sign(
        { user: body },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "300s" }
      );
      console.log("8 token. accessToken: ", accessToken);
      return res.json({ accessToken: accessToken, user: theUser });
    } else {
      return res.json({ accessToken: "" });
    }
  } catch (error) {
    console.log("now returning empty access token");
    return res.json({ accessToken: "" });
  }

  return res.json("post token bro");
});

app.post("/signup", (req, res) => {
  return res.send("Bro does it work?");
});

// startServer();

app.listen(port, () => {
  console.log(`Example app listening on port ${port} please work`);
});
