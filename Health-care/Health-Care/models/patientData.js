const mongoose = require('mongoose');

const patientDataSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
       
    },
    mobile: {
        type: Number,
        required: true,
        unique : true ,

    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    walkingData: Number,
    heartRate: Number,
    respiratoryRate: Number,
    bloodPressure: String,
    calories: Number,
    sleepQuality: Number,
    temperature: Number,
    // earlyDiagnosticReports: String,
    ecgInformation: String,
}, { timestamps: true });

const patientData = mongoose.model('patientData', patientDataSchema);

module.exports = patientData;
