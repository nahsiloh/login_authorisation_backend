const express = require("express");
const app = express();

app.use(express.json());

if (app.get("env") !== "test") {
  require("./db");
}

const users = require("./routes/user");
app.use("/users", users);

module.exports = app;
