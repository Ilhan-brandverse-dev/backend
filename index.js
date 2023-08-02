const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
require("./model")
const connect = require("./db/db")
dotenv.config();
const common = require('./routes/common');
const user = require('./routes/user');
const customer = require('./routes/customerRoutes')
connect() //connecting with mongo db

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(common)
app.use(user)
app.use("/api/customer",customer)

const PORT = process.env.PORT || 3002;
app.listen(PORT, (req, res) => {
  console.log(`Server running on ${PORT}`);
});

//atlas usernam pass
//ilhanshah123
//OZYMSkBwHYpDFccZ
