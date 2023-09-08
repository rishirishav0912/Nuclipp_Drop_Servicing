const mongoose= require("mongoose");

const projectSchema= new mongoose.Schema({
    Link:{
        type: String,
        required:true
    },
    Duration:{
        type: Number,
        required: true
    },
    Neeche:{
        type: String,
        required:true
    },
    Package:{
        type: String,
        required:true
    },
    Cost:{
        type: Number,
        required: true
    },
    Payment_Status:{
        type: String,
        default: "Unpaid"
    }
},{ timestamps: true})

const Project= mongoose.model("project",projectSchema);

module.exports= {Project,projectSchema};