const mongoose = require("mongoose");

const passportSchema = new mongoose.Schema({
    passportNumber: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    verificationStatus: {
        type: String,
        default: "Pending"
    }
});

const Passport = mongoose.model("Passport", passportSchema);

module.exports = Passport;