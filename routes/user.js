const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const JWT_SECRET_KEY = "Secret";

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    next(err);
  }
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
      throw new Error(`${password}, ${user.password}`);
    }

    const token = jwt.sign({ name: user.username }, JWT_SECRET_KEY);
    res.cookie("token", token);
    res.send(user);
  } catch (err) {
    if (err.message === "Login failed") {
      err.status = 400;
    }
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});

module.exports = router;
