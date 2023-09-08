const mongoose = require("mongoose");
const Employee = require("../models/employeeModel");
const Admin = require("../models/adminModel");

//check is the UserId is valid
const isValid = async (userType,PassedId) => { //returns boolean
    let value=false;
    if(userType == "employee"){
        await Employee.findOne({ UserId: PassedId }).then((foundId) => {
            if (!foundId) {
                value= true;
            }
        }).catch((error) => {
            alert(error);
        })
    }
    else if(userType == "admin"){
        await Admin.findOne({ AdminId: PassedId }).then((foundId) => {
            if (!foundId) {
                value= true;
            }
        }).catch((error) => {
            alert(error);
        })
    }
    else{
        res.status(400).json("User not indentified");
    }
    return value;
}

//check if UserId ans Password match the one we have in records.
const authenticatedUser = async (userType, userid, password) => { //returns boolean
    let value;
    if (userType == "employee") {
        await Employee.findOne({ UserId: userid, Password: password }).then((foundEmp) => {
            if (!foundEmp) {
                value=false;
            }
            value=foundEmp;
        }).catch((error) => {
            alert(error);
        })
    }
    else if (userType == "admin") {
        await Admin.findOne({ AdminId: userid, Password: password }).then((foundAdmin) => {
            if (!foundAdmin) {
                value=false;
            }
            value=foundAdmin;
        }).catch((error) => {
            alert(error);
        })
    }
    else {
        res.status(400).json({ error: "User not identified" });
    }
    return value;
}

module.exports={
    isValid,
    authenticatedUser
}