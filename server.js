// const dotenv = require("dotenv");
// dotenv.config();
// const express = require("express");
// const app = express();

// const mongoose = require("mongoose");
// const methodOverride = require("method-override");
// const morgan = require("morgan");

import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import mongoose from "mongoose";
import methodOverride from "method-override";
import morgan from "morgan";
import authController from "./controllers/auth.js"; // NEED TO CONFIRM IF THIS IS HOW YOU WRITE IT
import session from "express-session";

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

//importing middleware
app.use("/auth", authController);

//expresssession middleware

//Defining a route for index.ejs
app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});

app.get("/vip-lounge", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send("Sorry, no guests allowed.");
  }
});

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);

  app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
  });
});
