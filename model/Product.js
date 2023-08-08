const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customers'
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver'
    },
    name: {
        type: String,
        trim: true,
        default: null
    },
    status:{
        type: String,
        enum: ['Pending', 'Dispatched','Delivered','Cancelled'],
        default: 'Pending',
    },
    trackingId: {
        type: String,
        required: [false]
    },
    qrCode: {
        type: String,
        trim: true,
        default: null
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
    address:{
        type:String,
        required: [true, "Address is required"]
    },
    price:{
        type:Number,
        required:[true, "Price is requiured"]
    },
    weight: {
        type:String,
        required:[true, "Weight is required"]
    },
    recipientName: {
        type: String,
        required: [true, "Recipient name is required"]
    },
    recipientNumber: {
        type: String,
        required: [true, "Recipient number is required"]
    }
}, {
    timestamps: true
});
productSchema.index({ location: '2dsphere' });

mongoose.model('Product', productSchema);
