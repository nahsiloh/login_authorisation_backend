const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

router.get("/", async (req, res, next) => {
  try {
    const clients = await Client.find();
    res.send(clients);
  } catch (err) {
    next(err);
  }
});

router.post("/new", async (req, res, next) => {
  try {
    const client = new Client(req.body);
    await Client.init();
    const newClient = await client.save();
    res.send(newClient);
  } catch (err) {
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    next(err);
  }
});

module.exports = router;
