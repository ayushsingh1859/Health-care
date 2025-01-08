const { Router } = require("express");
const Doctor = require("../models/doctor");
const doctorData = require("../models/doctorDetails");
const patientappointment = require("../models/patientAppointment");


const router = Router();

router.get("/drLogin" , (req , res) => {
    return res.render("drLogin"); 
})



router.get("/drHome", async (req, res) => {
    try {
        const loggedIndoctor = await Doctor.findOne({});
        if (!loggedIndoctor) {
            return res.render("drLogin", { error: "No Doctor found" });
        }

        // Fetch all patient appointments
        const patientAppointments = await patientappointment.find({});

        // Pass fetched appointments to the EJS template
        return res.render("drHome", { 
            doctorName: loggedIndoctor.drname,
            patientappointments: patientAppointments
        });
    } catch (error) {
        console.error("Error fetching patient appointments:", error);
        return res.render("drHome", { error: "Error fetching patient appointments" });
    }
});




router.get("/drProfile" , async (req ,res) => {

    const loggedIndoctor = await Doctor.findOne({});
    if (!loggedIndoctor) {
        return res.render("drLogin", { error: "No Doctor found" });
    }

    const updateData = await doctorData.findOne({});

    return res.render("drProfile" , {
        doctorName : loggedIndoctor.drname , 
        doctorEmail : loggedIndoctor.dremail ,
        doctorNumber : updateData.mobile ,
       
       
    })
})


router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/"); 
  });




router.post("/drLogin" , async(req , res) => {
    const { dremail , drpassword } = req.body;

    try {
        const token = await Doctor.matchPasswordAndGenerateTokenDr(dremail , drpassword);

    return res.cookie("token" , token).redirect("drHome"); 
    } catch (error) {
        return res.render("drLogin" , {
            error : "Incorrect Email or Password" ,
        })
    }  
})






module.exports = router;