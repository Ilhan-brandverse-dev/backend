const jwt = require('jsonwebtoken')

const validateCustomerToken = (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.replace("Bearer ", "");
        jwt.verify(token, process.env.CUSTOMER_SECRET_KEY, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: "Unauthorized" })
            }else{
            req.user = decoded.customer;
            next();
            }
        })
    } else {
        res.status(401).json({ message: "Unauthorized user" })
    }
}
module.exports = validateCustomerToken;