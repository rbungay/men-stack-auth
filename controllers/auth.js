import { Router } from "express";
import User from "../models/user.js";
const router = Router();
import bcrypt from "bcrypt";

// build out routes here

//to get to the sign up place
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs", { user: req.session.user });
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
  req.session.user = user;
  //   res.send(`Thanks for signing up ${user.username}`);

  res.render("index.ejs");
});

//route for sign in
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});

router.post("/sign-in", async (req, res) => {
  // First, get the user from the database
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (!userInDatabase) {
    return res.send("Login failed. Please try again.");
  }

  // There is a user! Time to test their password with bcrypt
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  );
  if (!validPassword) {
    return res.send("Login failed. Please try again.");
  }

  // There is a user AND they had the correct password. Time to make a session!
  // Avoid storing the password, even in hashed format, in the session
  // If there is other data you want to save to `req.session.user`, do so here!
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id,
  };

  // res.send(`You logged in successfully! Welcome ${userInDatabase.username}`);
  res.redirect("/");
});

//signs out user
router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

export default router;
