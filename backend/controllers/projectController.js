const mongoose = require("mongoose");
const { Project } = require("../models/projectModel");
const Employee = require("../models/employeeModel");


//price a/c to package
const prices = {
    "silver": 100,
    "gold": 200,
    "diamond": 500,
    "platinum": 1000
}

//get all projects
const getprojects = (req, res) => {
    const id = req.params.employeeId;
    //getting employee by id in params
    Employee.findOne({ UserId: id }).then((foundEmp) => {

        if(!foundEmp){
            return res.status(400).json({error: "employee not found"})
        }
        
        //getting all projects with decreasing timestamp 
        let project = foundEmp["Projects"];
        if (project == undefined) {
            return res.status(200).json({ message: "no projects" });
        }
        else {
            return res.status(200).json(project);
        }
    }).catch((error) => {
        console.log(error);
        return res.status(400).json({ error: error.message });
    })

}

//adding a project
const addProject = async (req, res) => {
    const { link, duration, neeche, pkg } = req.body;
    const id = req.params.employeeId;
    const cost = (duration * prices[pkg]);

    let emptyFields = [];

    if (!link) emptyFields.push('link');
    if (!duration) emptyFields.push('duration');
    if (!pkg) emptyFields.push('pkg');
    if (!neeche) emptyFields.push('neeche');

    if (emptyFields.length > 0) return res.status(400).json({ error: 'fill in all the details', emptyFields });

    //finding employee
    await Employee.findOne({ UserId: id }).then((foundEmp) => {

        if(!foundEmp){
            return res.status(400).json({error: "employee not found"})
        }

        const project = new Project({         // creating project
            Link: link,
            Duration: duration,
            Neeche: neeche,
            Package: pkg,
            Cost: cost
        })
        foundEmp["Projects"].unshift(project);
        foundEmp.save().then(() => {
            return res.status(200).json(foundEmp["Projects"][0]);
        }).catch((error) => {
            return res.status(400).json({ error: "enter correct details" , emptyFields});
        });
    }).catch((error) => {
        return res.status(401).json({ error: error.message ,emptyFields });
    })

}

//deleting project
const deleteProject = async (req, res) => {
    const id = req.params.employeeId;
    const projectId = req.params.projectId;
    await Employee.findOne({ UserId: id }).then((foundEmp) => {     //finding employee
        
        if(!foundEmp){
            return res.status(400).json({error: "employee not found"})
        }

        //finding and deleting project
        let projects = foundEmp["Projects"];
        if (projects == undefined) {
            return res.status(200).json({ message: "no projects" });
        }
        else {
            let deletedProject = projects.find((project) => project._id == projectId);
            foundEmp["Projects"] = projects.filter((project) => project._id != projectId);
            foundEmp.save();
            return res.status(200).json(deletedProject);
        }
    }).catch((error) => {
        return res.status(400).json({ error: "project cannot be deleted" });
    })
}

//updating project details
const updateProject = async(req, res) => {
    const id = req.params.employeeId;
    const projectId = req.params.projectId;
    const { link, duration, neeche, pkg} = req.body;
    const cost = (duration * prices[pkg]);

    let emptyFields = [];

    if (!link) emptyFields.push('link');
    if (!duration) emptyFields.push('duration');
    if (!pkg) emptyFields.push('pkg');
    if (!neeche) emptyFields.push('neeche');

    if (emptyFields.length > 0) return res.status(400).json({ error: 'fill in all the details', emptyFields });

    await Employee.findOne({ UserId: id }).then((foundEmp) => {     //finding employee
        //finding and updating project
        if(!foundEmp){
            return res.status(400).json({error: "employee not found"})
        }
        const project = new Project({         // creating project
            Link: link,
            Duration: duration,
            Neeche: neeche,
            Package: pkg,
            Cost: cost,
            Payment_Status: 'Unpaid'
        })
        let projects = foundEmp["Projects"]
        let p = projects.indexOf(projects.find((project) => project._id == projectId));
        foundEmp["Projects"][p] = project;
        foundEmp.save().then(() => {
            return res.status(200).json(foundEmp["Projects"]);
        }).catch((error) => {
            return res.status(400).json({ error: "enter correct project details" , emptyFields});
        })
    }).catch((error) => {
        console.log(error);
        res.status(400).json({ error: error.message , emptyFields});
    })
}


module.exports = {
    addProject,
    getprojects,
    deleteProject,
    updateProject
};