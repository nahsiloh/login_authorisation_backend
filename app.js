const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000"],
  preflightContinue: false,
  credentials: true,
  allowedHeaders: "content-type"
};

app.use(cors(corsOptions));

if (app.get("env") !== "test") {
  require("./db");
}

const users = require("./routes/user");
app.use("/users", users);

module.exports = app;
