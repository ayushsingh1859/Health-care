const { randomBytes, createHmac } = require('crypto');
const { Schema , model } = require("mongoose");
const { createTokenForUser } = require('../services/authentication');


const patientSchema = new Schema({
    name : {
        type : String , 
        required : true,
    } , 
    email : {
        type : String , 
        required : true,
        unique : true ,
    } ,
    salt : {
        type : String ,
    } ,
    password : {
        type : String , 
        required : true , 

    } ,
} , { timestamps : true }
);

patientSchema.pre("save" , function(next) {
    const patient = this;

    if(!patient.isModified("password"))
    return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256" , salt)
    .update(patient.password)
    .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();

});


patientSchema.static("matchPasswordAndGenerateToken" , async function(email , password) {
    const patient = await this.findOne({ email });
    if(!patient)  throw new Error("User not found!");

    const salt = patient.salt;
    const hashedPassword = patient.password;

    const patientProvidedHash = createHmac("sha256" , salt)
    .update(password)
    .digest("hex");

    if(hashedPassword !== patientProvidedHash)
    throw new Error("Incorrect Password");


    const token = createTokenForUser(patient);
    return token;
})

const Patient = model("patient" , patientSchema);

module.exports = Patient;