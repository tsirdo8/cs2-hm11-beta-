const joi = require("joi");

const userSchema = joi.object({
    name: joi.string().min(3).max(100).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(100).required(),
    phoneNumber: joi.string().pattern(/^\d{10,15}$/).required(),
    address: joi.string().min(5).max(200).required(),

})

module.exports = userSchema