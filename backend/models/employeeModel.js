const mongoose = require("mongoose");
const { projectSchema } = require("./projectModel");

const employeeSchema = new mongoose.Schema({
    UserId: {
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
    },
    QR_Image: {
        type: String
    },
    Projects: [projectSchema]
})

const Employee = mongoose.model("employee", employeeSchema);

module.exports = Employee;