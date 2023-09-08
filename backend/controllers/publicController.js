const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const Employee = require("../models/employeeModel");
const Admin = require("../models/adminModel");
let { isValid, authenticatedUser } = require("../helperFunctions/publicHelper");

const registerUser = async (req, res) => {
    const { userType } = req.params;
    const { userid, name, password } = req.body;

    //validation
    if (!userid || !name || !password) {
        return res.status(400).json({ error: 'All details are required.' });
    }
    if (!userType) {
        return res.status(400).json({ error: "User not identified" });
    }
    else if (await isValid(userType, userid)) {
        //registering user
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ error: 'password not strong enough' });
        }
        if (userType == "employee") {
            const emp = new Employee({
                UserId: userid,
                Name: name,
                Password: password,
            })
            emp.save();
            return res.status(201).json({ message: "User registered successfully" });
        }
        else if (userType == "admin") {
            const adm = new Admin({
                AdminId: userid,
                Name: name,
                Password: password
            })
            adm.save();
            return res.status(201).json({ message: "User registered successfully" });
        }
        else {
            res.status(400).json({ error: "User not identified" });
        }
    }
    else {
        return res.status(400).json({ error: 'UserId already exists.' });
    }

}

const updateUser = async (req, res) => {
    const { userType } = req.params;
    const { newuserid, prevuserid, name, password, profilePhoto } = req.body;

    //validation
    let emptyFields = [];

    if (!newuserid) emptyFields.push('userid');
    if (!name) emptyFields.push('name');
    if (!password) emptyFields.push('password');

    if (emptyFields.length > 0) return res.status(400).json({ error: 'fill in all the details', emptyFields });

    else {
        let bool = true;

        if (newuserid != prevuserid) {
            bool = (await isValid(userType, newuserid));
        }

        //updating user details
        if (bool) {
            if (!validator.isStrongPassword(password)) {
                return res.status(400).json({ error: 'password not strong enough', emptyFields });
            }
            if (userType == "employee") {
                const { qrImage } = req.body;
                await Employee.findOneAndUpdate({ UserId: prevuserid }, {
                    UserId: newuserid,
                    Name: name,
                    Password: password,
                    Profile_Photo: profilePhoto,
                    QR_Image: qrImage
                }
                ).then(() => {
                    return res.status(201).json({ message: "User details updated successfully" });
                }).catch((error) => {
                    return res.status(400).json({ error: error.message, emptyFields });
                })

            }
            else if (userType == "admin") {
                await Admin.findOneAndUpdate({ UserId: userid }, {
                    UserId: newuserid,
                    Name: name,
                    Password: password,
                    Profile_Photo: profilePhoto
                }
                ).then(() => {
                    return res.status(201).json({ message: "User details updated successfully" });
                }).catch((error) => {
                    return res.status(400).json({ error: error.message, emptyFields });
                })
            }
        }
        else {
            return res.status(400).json({ error: 'UserId already exists.', emptyFields });
        }
    }
}

const loginUser = async (req, res) => {
    const { userType } = req.params;
    const { userid, password } = req.body;
    // Check if userid and password are provided
    if (!userid || !password) {
        return res.status(404).json({ error: 'Username and password are required.' });
    }
    // User authentication successful, generate JWT token
    let user = await authenticatedUser(userType, userid, password);
    if (user) {
        const token = jwt.sign({ userid }, 'fingerprint_customer');
        req.session.authorization = {
            token, userid
        }
        return res.status(200).json({ userid, userType, token });
    }
    else {
        return res.status(400).json({ error: "Invalid Login,User not registered" });
    }
}

module.exports = {
    registerUser,
    updateUser,
    loginUser
}