const express = require('express')
const router = express.Router();
const { signIn, signUp, signOut, updatePassword, } = require("../controller/commonController");
const authUser = require('../middleware/authUser');
const { upload } = require('../middleware/multer');

router.post('/api/signup', signUp)

router.post('/api/signin', signIn)

router.post('/api/changepassword', authUser, updatePassword)

router.post('/api/signout', authUser, signOut)


module.exports = router