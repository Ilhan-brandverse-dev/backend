const mongoose = require('mongoose')
const CustomerModel = require('../model/Customer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Product = mongoose.model('Product');



const getAllCustomers = async (req, res) => {
    console.log("in get all customer")
    const customers = await CustomerModel.find();
    res.status(200).json(customers)
}


const getSingleCustomer = async (req, res) => {
    try {
        const phoneNumber = req.query.customer_number;
        console.log(`+${phoneNumber.trim()}`)
        if(!phoneNumber){
            res.status(404).json({message: "Phone number is required"});
        }

        const customer = await CustomerModel.findOne({ phoneNumber:`+${phoneNumber.trim()}` })
        if (customer) {
            res.status(200).json({ customer })
        } else {
            res.status(404).json({ message: "Customer doesn't exist" })
        }
    } catch (e) {
        res.status(400).json({ message: e.message })
    }

}

const addCustomer = async (req, res) => {
    try {
        console.log("in add customer")
        const { phoneNumber, email, password } = req.body;
        const customerAvailable = await CustomerModel.findOne({ phoneNumber })
        if (customerAvailable) {
            res.status(400).json({ message: "Customer with this phone number already exists" })
        } else {
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10)
            console.log(hashedPassword)
            const customer = await CustomerModel.create({ phoneNumber, email, password: hashedPassword })
            res.status(200).json({
                message: "Customer added successfully", customer: {
                    id: customer._id,
                    email: customer.email,
                    phoneNumber: customer.phoneNumber
                }
            })
        }
    } catch (e) {
        res.status(400).json({ message: e.message })
    }
}

const loginCustomer = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        console.log(req.body);
        if (!phoneNumber || !password) {
            throw new Error("All fields are mandatory")
        }
        console.log("in func");
        const customerAvailable = await CustomerModel.findOne({phoneNumber:"+923168958164"})
        console.log(customerAvailable)
        const isPassValid = await bcrypt.compare(password, customerAvailable.password)
        if(customerAvailable && isPassValid){
            const accessToken = jwt.sign({
                customer:{
                    id: customerAvailable._id,
                    phoneNumber: customerAvailable.phoneNumber,
                    email: customerAvailable.email
                    
                }
            }, process.env.CUSTOMER_SECRET_KEY,
            {expiresIn: "1h"}
            )
            res.status(200).json({token:accessToken, customer: customerAvailable})

        }else{
            res.status(401).json({ message: "Customer doesn't exist" })
        }

    } catch (e) {
        res.status(400).json({ message: e.message })
    }
}

const getCustomerProducts = async(req,res)=>{
    try{
        const customerId = req.user.id;
        console.log(customerId)
        const allProducts = await Product.find({customerId})
        return res.status(200).json({products:allProducts})
    }
    catch(e){
        console.log(e)
        return res.status(500).json({message:"Something went wrong"});
    }
}

module.exports = { getAllCustomers, getSingleCustomer, addCustomer, loginCustomer, getCustomerProducts }