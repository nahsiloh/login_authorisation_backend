const mongoose = require("mongoose");
const dbName = "user-db";

let dbUrl;
if (process.env.NODE_ENV === "development") {
  dbUrl = `mongodb://localhost/${dbName}`;
}

mongoose.connect(dbUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connected to MongoDB server");
});
