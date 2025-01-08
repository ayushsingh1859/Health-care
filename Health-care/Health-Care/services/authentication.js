const JWT = require("jsonwebtoken");


const secret = "$uperMan@1234";

function createTokenForUser(patient){
    const payload = {
        _id: patient._id,
        email: patient.email,
    };
    const token = JWT.sign(payload , secret);
    return token;
}

function validateToken(token){
    const payload = JWT.verify(token , secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
};