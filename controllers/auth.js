import { Router } from "express";
import User from "../models/user.js";
const router = Router();
import bcrypt from "bcrypt";

// build out routes here

//to get to the sign up place
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

//to POST TO THE ACTUAL PAGE
router.post("/sign-up", async (req, res) => {
  if (req.body.password !== req.body.confirmPassword) {
    return res.send("Password and Confirm Password must match");
  }

  const userInDatabase = await User.findOne({ username: req.body.username });
  if (userInDatabase) {
    return res.send("Username already taken.");
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;

  const user = await User.create(req.body);
  //   res.send(`Thanks for signing up ${user.username}`);

  res.render("index.ejs");
});

//route for sign in
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});

router.post("/sign-in", async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (!userInDatabase) {
    return res.send("Login failed. Please try again.");
  }
  // returns a boolean to confirm if they are signing in matches.
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  );
  if (!validPassword) {
    return res.send("Login failed. Please try again.");
  }

  res.send(`You logged in successfully! Welcome ${userInDatabase.username}`);
});

export default router;
