require("dotenv").config();
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    secretKey: String,
    AdminId: {
        type: String,
        required: true,
        unique: true
    },
    Name: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Profile_Photo: {
        type: String
    }
})

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;