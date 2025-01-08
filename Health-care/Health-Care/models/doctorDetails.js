const mongoose = require('mongoose');

const doctorDataSchema = new mongoose.Schema({
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
        unique: true
    },
    mobile: {
        type: Number,
        required: true,
       

    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    
  
}, { timestamps: true });

const doctorData = mongoose.model('doctorData', doctorDataSchema);

module.exports = doctorData;
