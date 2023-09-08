const express= require("express");
const router= express.Router();
const {registerUser,loginUser}=require("../controllers/publicController")

//registering a user
router.post("/register/:userType",registerUser);

module.exports= router;