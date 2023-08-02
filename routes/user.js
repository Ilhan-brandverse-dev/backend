const express = require('express')
const router = express.Router();
const { addDriver, allDrivers, deleteDriver, addProduct, allProducts, dashboard, dispatchProduct, deliverProduct } = require("../controller/userController")
const authUser = require('../middleware/authUser');
const { upload } = require('../middleware/multer');

router.post('/api/addDriver', authUser, addDriver)

router.get('/api/allDrivers', authUser, allDrivers)

router.delete('/api/deleteDriver/:id', authUser, deleteDriver)

router.post('/api/addProduct', authUser, addProduct)

router.get('/api/allProducts', authUser, allProducts)

router.get('/api/dashboard', authUser, dashboard)

router.post('/api/dispatchProduct', authUser, dispatchProduct)

router.post('/api/deliverProduct',authUser, deliverProduct)

module.exports = router