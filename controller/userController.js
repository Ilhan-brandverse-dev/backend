const mongoose = require('mongoose')
const Driver = mongoose.model('Driver');
const Users = mongoose.model('Users');
const Product = mongoose.model('Product');
const ProductStatus = require('../utils/constants');
const CustomerModel = require('../model/Customer')
const bcrypt = require('bcrypt')
const client = require("twilio")(
    "ACd96bb22962c305384779e1296e01c6ce",
    "333ae246ab0abeb2220d288d523e02be"
);
async function sendTextMessage(email, password) {
    let messageId = await client.messages.create({
        body: `Thanks for joining into fleet system rider.Your
    email : ${email}  password : ${password}`,
        from: "+15186258476",
        to: "+923343497059",
    });
    return messageId;
}
const addDriver = async (req, res) => {
    try {
        const { name, email, age, cnicNo, phone, lat, long } = req.body
        let ramdomPassword = Math.random().toString(36).slice(-8);
        const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!name) {
            return res.status(400).send({ status: 0, message: "Name field can't be empty." });
        } else if (!email) {
            return res.status(400).send({ status: 0, message: "Email field can't be empty." });
        }
        else if (!email.match(emailValidation)) {
            return res.status(400).send({ status: 0, message: "Invalid email address" })
        }
        else if (!age) {
            return res.status(400).send({ status: 0, message: "Age field can't be empty." });
        }
        else if (!cnicNo) {
            return res.status(400).send({ status: 0, message: "CNIC field can't be empty." });
        }
        else if (!phone) {
            return res.status(400).send({ status: 0, message: "Phone field can't be empty." });
        }
        else if (!lat || !long) {
            return res.status(400).send({ status: 0, message: "Location field can't be empty." });
        }
        else {
            const stringPhone = phone.toString()
            const pass = stringPhone.substring(stringPhone.length - 4)
            console.log("Rider pass", pass)
            const hashedPassword = await bcrypt.hash(pass, 10)
            const driver = new Driver({
                name, email, age, cnicNo, phone, password: hashedPassword, "location.type": "Point", "location.coordinates": [parseFloat(long), parseFloat(lat)],
            })
            await driver.save()
            // let response = await sendTextMessage(email, ramdomPassword);
            if (driver) {
                return res.status(200).send({ status: 1, message: "Driver Added Successfully" })
            }
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({ status: 0, message: "Something went wrong" });
    }
}

const loginDriver = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("Email and password is mandatory")
        }

        const rider = await Driver.findOne({ email })
        if (!rider) {
            res.status(400).send({ message: "Invalid Email." })
        } else {
            const isPassValid = await bcrypt.compare(password, rider.password)
            if (!isPassValid) {
                res.status(400).send({ message: "Invalid Password." })
            } else {
                res.status(200).send({ driver: rider })
            }
        }
    }
    catch (e) {
        console.log(e)
        res.status(500).send({ message: e.message })
    }
}

const allDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find()
        if (drivers?.length > 0) {
            return res.status(200).send({ status: 1, drivers });

        } else {
            return res.status(400).send({ status: 0, message: "No Driver Found" });
        }
    } catch (error) {
        return res.status(500).send({ status: 0, message: "Something went wrong" });
    }
}

const deleteDriver = async (req, res) => {
    try {
        const _id = req.params.id;
        const drivers = await Driver.findByIdAndDelete({ _id })
        if (drivers) {
            return res.status(200).send({ status: 1, message: "Driver Deleted Successfully" });

        } else {
            return res.status(400).send({ status: 0, message: "No Driver Found" });
        }
    } catch (error) {
        return res.status(500).send({ status: 0, message: "Something went wrong" });
    }
}

const addProduct = async (req, res) => {
    try {
        const { name, customerId, qrCode, lat, long, address, price, weight, recipientName, recipientNumber } = req.body
        if (!name || !price || !weight) {
            return res.status(400).send({ status: 0, message: "Product details can't be empty." });
        } else if (!customerId) {
            return res.status(400).send({ status: 0, message: "Customer can't be empty" });
        }
        else if (!lat || !long || !address) {
            return res.status(400).send({ status: 0, message: "Dropoff Location and address field can't be empty." });
        }
        else if (!recipientName || !recipientNumber) {
            return res.status(400).send({ status: 0, message: "Recipient detail can't be empty." });
        }
        else {
            const customer = await CustomerModel.findById(customerId)
            if (!customer) {
                return res.status(400).send({ status: 0, message: "Customer not found." });
            }
            const product = new Product({
                createdBy: req.user._id, customerId, name, qrCode, address, price, weight, recipientName, recipientNumber, "location.type": "Point", "location.coordinates": [parseFloat(long), parseFloat(lat)],
            })
            await product.save()
            if (product) {
                return res.status(200).send({ status: 1, message: "Product Added Successfully" })
            }
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({ status: 0, message: "Something went wrong" });
    }
}

const dispatchProduct = async (req, res) => {
    try {
        const { productId, riderId } = req.body;
        if (!productId) {
            return res.status(400).send({ status: 0, message: "Please select a product to dispatch." })
        } else if (!riderId) {
            return res.status(400).send({ status: 0, message: "Please select a Rider to dispatch." })
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).send({ status: 0, message: "No Product found." })
        }
        const updatedProduct = await product.updateOne({ assignTo: riderId, status: ProductStatus.Dispatched })
        if (updatedProduct) {
            return res.status(200).send({ status: 1, message: "Product Updated Successfully" })
        } else {
            return res.status(400).send({ status: 0, message: "Product not updated" })
        }
    } catch (e) {
        console.log(e);
        return res.status(500).send({ status: 0, message: "Something went wrong" });
    }
}

const addTrackingId = async (req, res) => {
    try {
        const { productId, trackingId } = req.body;
        if (!productId || !trackingId) {
            return res.status(400).send({ message: "Product ID and tracking ID is mandatory." })
        } else {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(400).send({ status: 0, message: "No Product found." })
            }
            const updatedProduct = await product.updateOne({ trackingId })
            if (updatedProduct) {
                return res.status(200).send({ status: 1, message: "Product Updated Successfully" })
            } else {
                return res.status(400).send({ status: 0, message: "Product not updated" })
            }
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ message: "Something went wrong" });
    }
}

const deliverProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).send({ status: 0, message: "Please select a product to dispatch." })
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).send({ status: 0, message: "No Product found." })
        }
        const updatedProduct = await product.updateOne({ status: ProductStatus.Delivered })
        if (updatedProduct) {
            return res.status(200).send({ status: 1, message: "Product Updated Successfully" })
        } else {
            return res.status(400).send({ status: 0, message: "Product not updated" })
        }
    } catch (e) {
        return res.status(500).send({ status: 0, message: "Something went wrong" });
    }
}

const allProducts = async (req, res) => {
    try {
        const products = await Product.find().populate({
            path: 'customerId',
        })
        const productsWithUserPhone = products.map(product => ({
            ...product.toObject(), // Convert product to plain JavaScript object
            userPhone: product.customerId ? product.customerId.phoneNumber : null,
            customer: product.customerId
        }));
        const productsParsed = productsWithUserPhone.map(product => {
            const { customerId, ...productData } = product;
            return { ...productData, customerId: customerId?._id };
        });
        if (products?.length > 0) {
            return res.status(200).send({ status: 1, productsParsed });
        } else {
            return res.status(400).send({ status: 0, message: "No Products Found" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "Something went wrong" });
    }
}

const allPendingProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: ProductStatus.Pending }).populate({ path: 'customerId' })
        res.status(200).send({ products })
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
}

const getRiderProducts = async (req,res) => {
    const {riderId} = req.body;
    console.log(riderId);
    try {
        const products = await Product.find({ status: ProductStatus.Dispatched,assignTo: riderId  }).populate({ path: 'customerId' })
        const productsWithUserPhone = products.map(product => ({
            ...product.toObject(), // Convert product to plain JavaScript object
            userPhone: product.customerId ? product.customerId.phoneNumber : null,
            customer: product.customerId
        }));
        const productsParsed = productsWithUserPhone.map(product => {
            const { customerId, ...productData } = product;
            return { ...productData, customerId: customerId?._id };
        });
        res.status(200).send({ products:productsParsed })
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
}

const dashboard = async (req, res) => {
    try {
        const usersCount = await Users.find().countDocuments()
        const driverCount = await Driver.find().countDocuments()
        const productCount = await Product.find().countDocuments()
        res.status(200).send({ status: 1, usersCount, driverCount, productCount })
    } catch (err) {
        return res.status(500).send({ status: 0, message: "Something went wrong" })
    }
}

module.exports = { addDriver, allDrivers, deleteDriver, addProduct, allProducts, dashboard, dispatchProduct, deliverProduct, loginDriver, allPendingProducts, addTrackingId, getRiderProducts }