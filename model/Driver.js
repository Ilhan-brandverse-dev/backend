const mongoose = require("mongoose");
const driverSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: [true, "Email is required"]
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        age: {
            type: Number,
            required: false
        },
        phone: {
            type: Number,
            required: false
        },
        cnicNo: {
            type: Number,
            required: false
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: false,
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                required: false,
                default: null
            },
        },
    },
    {
        timestamps: true,
    }
);
driverSchema.index({ location: '2dsphere' }); 
mongoose.model("Driver", driverSchema);
