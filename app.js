const express = require("express");
const app = express();

app.use(express.json());

if (process.env.NODE_ENV !== "client-db") {
  require("./db");
}

const clients = require("./routes/clients");
app.use("/clients", clients);

module.exports = app;
