const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

app.use(cookieParser());
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
