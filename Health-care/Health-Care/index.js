const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
// const session = require('express-session');

const cookieParser = require("cookie-parser");


//Python
const { spawn } = require('child_process');


const handlePredictedDisease = (req, res, next) => {
// Define the command to run your Python script
const pythonProcess = spawn('python', ['./prediction/disease_prediction_f.py']);

// Listen for output data from the Python script
let predictedDisease = '';

pythonProcess.stdout.on('data', (data) => {
  predictedDisease += data.toString();
//   console.log(predictedDisease);
});

// Listen for errors from the Python script
pythonProcess.stderr.on('data', (data) => {
//   console.error(`Python script error: ${data}`);
});


pythonProcess.on('close', (code) => {
    if (code === 0) { // Check if the Python script exited successfully
        res.locals.predictedDisease = predictedDisease;
        next();
    } else {
        console.error(`Python script exited with code ${code}`);
        next(new Error("Failed to predict disease")); // Pass error to error handling middleware
    }
});

}


const app = express();
const PORT = 3000;


const patientRoute = require("./routes/patient");
const doctorRoute = require("./routes/doctor");


//DataBase Connection
mongoose.connect('mongodb://127.0.0.1:27017/HealthCare').then((e) => console.log("MongoDB Connected"));

//for Css
app.use(express.static(path.join(__dirname, "public")));


//for Ejs
app.set("view engine" , "ejs");
app.set("views" , path.resolve("./views"));


//MiddleWares
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));





app.get("/" , (req , res) => {
    res.render("home");
})


app.use("/patient" , patientRoute);
app.use("/doctor" , doctorRoute);




app.listen(PORT  , ()=> {
    console.log(`Server Started at ${PORT}`);
})