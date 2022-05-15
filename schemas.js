const mongoose = require("mongoose");
const config = require("./config");

exports.Email = mongoose.model(
    config.mongoCollection,
    new mongoose.Schema({
        id: String,
        from: String,
        to: String,
        subject: String,
        text: String
    })
);