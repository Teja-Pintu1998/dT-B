const validator = require("validator");

const validateSignupData = (req)=>{
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("First name and last name are required");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid email");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }

};

const validateProfileEditData = (req)=>{
    const allowedEdits = [
        "firstName",
        "lastName",
        "emailId",
        "age",
        "skills",
        "gender",
        "photoUrl",
        "about",
    ];

    const isEditAllowed = Object.keys(req.body).every((key) =>
    allowedEdits.includes(key)
    );
    return isEditAllowed;
};

module.exports = {validateSignupData, validateProfileEditData};