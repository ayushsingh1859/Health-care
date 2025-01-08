const { randomBytes, createHmac } = require('crypto');
const { Schema , model } = require("mongoose");
const { createTokenForUser } = require('../services/authentication');

const doctorSchema = new Schema({
    drname : {
        type : String , 
        required : true,
    } , 
    dremail : {
        type : String , 
        required : true,
        unique : true,
    } ,
    salt : {
        type : String ,
    } ,
    drpassword : {
        type : String , 
        required : true , 

    } ,
} , { timestamps : true }
);

doctorSchema.pre("save" , function(next) {
    const doctor = this;

    if(!doctor.isModified("drpassword"))
    return;

    const salt = randomBytes(16).toString();
    const hasheddrPassword = createHmac("sha256" , salt)
    .update(doctor.drpassword)
    .digest("hex");

    this.salt = salt;
    this.drpassword = hasheddrPassword;

    next();

});


doctorSchema.static("matchPasswordAndGenerateTokenDr" , async function(dremail , drpassword) {
    const doctor = await this.findOne({ dremail });
    if(!doctor)  throw new Error("User not found!");

    const salt = doctor.salt;
    const hashedPassword = doctor.drpassword;

    const doctorProvidedHash = createHmac("sha256" , salt)
    .update(drpassword)
    .digest("hex");

    if(hashedPassword !== doctorProvidedHash)
    throw new Error("Incorrect Password");


    const token = createTokenForUser(doctor);
    return token;
})

const Doctor = model("doctor" , doctorSchema);

module.exports = Doctor;