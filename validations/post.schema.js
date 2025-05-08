const joi = require('joi');

const postSchema = joi.object({
    title: joi.string().min(3).max(100).required(),
    content: joi.string().min(10).max(5000).required(),
});


module.exports = postSchema