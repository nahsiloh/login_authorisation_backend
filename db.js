const mongoose = require("mongoose");
const dbName = "client-db";

let dbUrl;
if (process.env.NODE_ENV === "development") {
  dbUrl = `mongodb://localhost/${dbName}`;
}

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connected to MongoDB server");
});
