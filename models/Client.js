const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  username: { type: String, required: true }
  // email: { type: String, required: true, index: true, unique: true },
  // password: { type: String, required: true, minlength: 8 }
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
