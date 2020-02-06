const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const authenticationController = async (req, res, next) => {
  try {
    if (!req.cookies.token) {
      throw new Error("Login to receive your secret message");
    }
    req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    next();
  } catch (err) {
    res.status(401).end("You are not authorized!");
  }
};

router.get("/message", authenticationController, async (req, res, next) => {
  res.send("The Secret is Emporio Analytics");
});

router.post("/new", async (req, res, next) => {
  try {
    const user = new User(req.body);

    const rounds = 10;
    const hash = await bcrypt.hash(user.password, rounds);
    user.password = hash;

    await User.init();
    const newUser = await user.save();
    res.send(newUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new Error("Login failed");
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET_KEY
    );
    res.cookie("token", token);
    res.send(user);
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});

module.exports = router;
