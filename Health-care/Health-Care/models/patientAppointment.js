const mongoose = require('mongoose');

const patientAppointmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,

    },
    time: {
        type: String,
        required: true ,
        unique : true ,
    },
}, { timestamps: true });

const patientAppointment = mongoose.model('patientAppointment', patientAppointmentSchema);

module.exports = patientAppointment;
