const { default: mongoose } = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    adminStatus: {
    type: Boolean,
    default: false, 
  },
    avatar: {
         type: String 
        },
    createdAt: {
        type: Date,
        default: Date.now
    },
    
})


const User = mongoose.model('User', userSchema)
module.exports = User