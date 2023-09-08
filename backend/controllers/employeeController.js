const Employee = require("../models/employeeModel");

//get all employee
const getemployees = (req, res) => {
    Employee.find({}).then((employees) => {
        if (!employees) {
            res.status(400).alert("No employees found");
        }
        res.status(200).json(employees);
    }).catch((error) => {
        res.status(400).json({ error: error.message });
    })
}

const getemployee = (req, res) => {
    const employeeId = req.params.employeeId;
    Employee.findOne({ UserId: employeeId }).then((employee) => {
        if (!employee) {
            res.status(400).alert("employee not found");
        }
        res.status(200).json(employee);
    }).catch((error) => {
        res.status(400).json({ error: error.message });
    })
}

module.exports = {
    getemployees,
    getemployee
};