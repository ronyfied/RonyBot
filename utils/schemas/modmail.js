const mongoose = require("mongoose");

const modmailSchema = new mongoose.Schema({
    guild: String,
    user: String
});

module.exports = mongoose.model("modmail", modmailSchema);