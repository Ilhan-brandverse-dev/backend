const express = require('express')
const router = express.Router()
const {getAllCustomers, getSingleCustomer, addCustomer,loginCustomer,getCustomerProducts} = require('../controller/customerController')
const validateCustomerToken = require('../middleware/validateCustomerToken')

router.route("/all").get(getAllCustomers)
router.route('/get').get(getSingleCustomer)

router.route("/add").post(addCustomer)
router.route("/login").post(loginCustomer)

router.get('/products',validateCustomerToken, getCustomerProducts)



module.exports =  router