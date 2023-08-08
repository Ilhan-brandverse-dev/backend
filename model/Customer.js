const mongoose = require('mongoose')

const CustomerSchema = mongoose.Schema({
    phoneNumber: {
        type: String,
        required: [true, "Customer mobile number is mandatory"],
        unique: [true, "Customer phone number alread exist"]
    },
    email: {
        type: String,
        required: [true, "Customer email is mandatory"]
    },
    password: {
        type: String,
        required: [true, "Customer password is mandatory"]
    },
    name: {
        type: String,
        required: [true, "User name is mandatory"]
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Customers', CustomerSchema);