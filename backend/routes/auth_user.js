const express = require("express");
const router= express.Router();
const {addProject,
    getprojects,
    deleteProject,
    updateProject}=require("../controllers/projectController");
const {
    getemployees,getemployee
}=require("../controllers/employeeController");
const {loginUser, updateUser}=require("../controllers/publicController")

//logging a user
router.post("/login/:userType",loginUser);

//update user profile
router.patch("/auth/:userType/update",updateUser);

//for all employee

//get all projects
router.get("/auth/employee/:employeeId",getprojects)

//add a project
router.post("/auth/employee/:employeeId",addProject)

//delete a project
router.delete("/auth/employee/:employeeId/:projectId",deleteProject)

//update a project
router.patch("/auth/employee/:employeeId/:projectId",updateProject)

// for all admins

//get all emoloyees
router.get("/auth/admin/",getemployees);

//get a employee
router.get("/auth/admin/:employeeId",getemployee);

//get all projects
router.get("/auth/admin/:employeeId/projects",getprojects);

//update a project
router.patch("/auth/admin/:employeeId/projects/:projectId",updateProject);

module.exports= router;