require("dotenv").config()
const express= require("express");
const mongoose= require("mongoose");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const session = require("express-session");
const publicRoutes= require("./routes/public");
const userRoutes=require("./routes/auth_user");

//express app
const app = express();

//connect to nuclip database
mongoose.connect("mongodb://127.0.0.1:27017/nuclipDB").then(()=>{
    console.log("connected to database");
}).catch((error)=>{
    console.log(error);
})

//middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

app.use("/user",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}));

// authentication mechanism 
app.use("/user/auth/*",function auth(req,res,next){
if(req.session.authorization) {
    
    let token = req.session.authorization['token'];
     // Access Token
    jwt.verify(token, "fingerprint_customer",(err,user)=>{
        if(!err){
            req.user = user;
            next();
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });
 } else {
     return res.status(403).json({message: "User not logged in"})
 }

});

//routes
app.use("/user",userRoutes);
app.use("/",publicRoutes);

//listening to port 4000
app.listen(process.env.PORT,(req,res)=>{
    console.log("server is running at port ",process.env.PORT);
})