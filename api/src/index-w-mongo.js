import express from "express";
import cors from "cors";
const app = express();
const port = 4000;
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { jwtStrategy, passportLocalStrategy } from "./strategies.mjs";
import { User } from "./models/User.mjs";

console.log("1 index.");
console.log("2 index.");

passportLocalStrategy();
jwtStrategy();

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};

const startServer = async () => {
  console.log("1 startServer");

  app.use(passport.initialize());
  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  await mongoose.connect(
    `mongodb+srv://john:${process.env.MONGO_PASS}@music-app.wixv4kc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
    }
  );
  console.log("3 mongoose connected");

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

app.get("/users", async (req, res) => {
  let query = {};
  const users = await User.find(query);
  console.log("users in rest server: ", users);
  return res.send(users);
});

app.get("/user", (req, res) => {
  return res.send("Bro does it work?");
});

app.get("/currentuser", (req, res) => {
  return res.send("Bro does it work?");
});

app.post("/logout", (req, res) => {
  return res.send("Bro does it work?");
});

app.post("/login", (req, res) => {
  return res.send("Bro does it work?");
});

app.post("/token", (req, res) => {
  return res.send("Bro does it work?");
});

app.post("/signup", (req, res) => {
  return res.send("Bro does it work?");
});

startServer();
