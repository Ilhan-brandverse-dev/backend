const mongoose = require('mongoose')
const Users = mongoose.model('Users');
const bcrypt = require('bcrypt');


const signUp = async (req, res) => {
    try {
        const { email, password, confirmPassword, name, } = req.body;
        const ex = await Users.findOne({ email: email?.toLowerCase() })
        const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const pass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/
        if (!name) {
            return res.status(400).send({ status: 0, message: "Name field can't be empty" })
        }
        else if (!email) {
            return res.status(400).send({ status: 0, message: "Email field can't be empty" })
        }
        else if (!email.match(emailValidation)) {
            return res.status(400).send({ status: 0, message: "Invalid email address" })
        }
        else if (ex) {
            return res.status(400).send({ status: 0, message: `Email Already Exist` })
        }
        else if (!password) {
            return res.status(400).send({ status: 0, message: "Password field can't be empty" })
        }
        else if (!password.match(pass)) {
            return res.status(400).send({ status: 0, message: "Password should be 8 characters long (should contain uppercase, lowercase, numeric and special character)" })
        }
        else if (!confirmPassword) {
            return res.status(400).send({ status: 0, message: "Confirm Password field can't be empty" })
        }
        else if (!confirmPassword.match(pass)) {
            return res.status(400).send({ status: 0, message: "Password and Confirm Password must be same" })
        }
        else if (password != confirmPassword) {
            return res.status(400).send({ status: 0, message: "Password and Confirm Password must be same" })
        }
        else {
            const checkUser = await Users.findOne({ email: email?.toLowerCase() })
            if (!checkUser) {
                const user = new Users({
                    email, password, name
                });
                await user.save();
                return res.status(200).send({ status: 1, message: "Account Created Successfully", data: checkUser })
            }
        }
    }
    catch (err) {
        return res.status(500).send({ status: 0, message: "Something went wrong" })
    }
}


const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!email) {
            return res.status(400).send({ status: 0, message: "Email field can't be empty" })
        }
        else if (!email.match(emailValidation)) {
            return res.status(400).send({ status: 0, message: "Invalid email address" })
        }
        const user = await Users.findOne({ email: email?.toLowerCase() })
        if (!user) {
            return res.status(400).send({ status: 0, message: "User not found" })
        }
        else if (!password) {
            return res.status(400).send({ status: 0, message: "Password field can't be empty" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ status: 0, message: "Password is not valid" });
        }
        else {
            await user.generateAuthToken();
            await user.save()
            res.status(200).send({ status: 1, message: "Login Successfully", data: user })
        }

    } catch (err) {
        return res.status(500).send({ status: 0, message: "Something went wrong" })
    }
}

const updatePassword = async (req, res) => {
    try {
        const pass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/
        const { existingPassword, confirmNewPassword, newPassword } = req.body;
        if (!existingPassword) {
            return res.status(400).send({ status: 0, message: "Current Password field can't be empty" })
        }
        const userCheck = await Users.findOne({ _id: req.user._id })
        const isMatch = await bcrypt.compare(existingPassword, userCheck.password);
        if (!isMatch) {
            return res.status(400).send({ status: 0, message: "Invalid Current Password" })
        }
        else if (!newPassword) {
            return res.status(400).send({ status: 0, message: "New Password field can't be empty" })
        }
        else if (!newPassword.match(pass)) {
            return res.status(400).send({ status: 0, message: "Password should be 8 characters long (should contain uppercase, lowercase, numeric and special character)" })
        }
        else if (!confirmNewPassword) {
            return res.status(400).send({ status: 0, message: "Confirm New Password field can't be empty" })
        }
        else if (!confirmNewPassword.match(pass)) {
            return res.status(400).send({ status: 0, message: "Password should be 8 characters long (should contain uppercase, lowercase, numeric and special character)" })
        }
        else if (newPassword !== confirmNewPassword) {
            return res.status(400).send({ status: 0, message: "New Password and Confirm New Password should be same" })
        }
        else if (existingPassword == newPassword || existingPassword == confirmNewPassword) {
            return res.status(400).send({ status: 0, message: "Current password and new password can't be same" })
        }
        else if (!userCheck) {
            return res.status(400).send({ status: 0, message: "User Not Found" })
        }
        else {
            await userCheck.comparePassword(existingPassword);
            const salt = await bcrypt.genSalt(10);
            const pass = await bcrypt.hash(newPassword, salt);
            await Users.findByIdAndUpdate({ _id: req.user._id }, { $set: { password: pass } })
            res.status(200).send({ status: 1, message: "Password Changed successfully" })
        }
    }
    catch (err) {
        return res.status(500).send({ status: 0, message: "Something went wrong" })
    }
}


const signOut = async (req, res) => {
    try {
        const user = await Users.findOne({ _id: req.user._id })
        if (!user) {
            return res.status(400).send({ status: 0, message: "User not found" })
        } else {
            user.token = null
            user.save()
            res.status(200).send({ status: 1, message: "User Logged Out" })
        }
    } catch (err) {
        return res.status(500).send({ status: 0, message: "Something went wrong" })
    }
}


module.exports = { signUp, signIn, signOut, updatePassword }