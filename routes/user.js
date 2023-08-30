const express = require('express')
const router = express.Router();
const { addDriver, allDrivers, deleteDriver, addProduct, allProducts, dashboard, dispatchProduct, deliverProduct, loginDriver, allPendingProducts } = require("../controller/userController")
const authUser = require('../middleware/authUser');
const { upload } = require('../middleware/multer');

router.post('/api/loginDriver', loginDriver)

router.post('/api/addDriver', authUser, addDriver)

router.get('/api/allDrivers', authUser, allDrivers)

router.delete('/api/deleteDriver/:id', authUser, deleteDriver)

router.post('/api/addProduct', authUser, addProduct)

router.get('/api/allProducts', authUser, allProducts)

router.get('/api/allPendingProducts', allPendingProducts)

router.get('/api/dashboard', authUser, dashboard)

router.post('/api/dispatchProduct', dispatchProduct)

router.post('/api/deliverProduct', deliverProduct)

module.exports = router