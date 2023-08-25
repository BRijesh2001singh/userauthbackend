const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
require('dotenv').config();
const userRouter = require('./routes/user')
require('./connection/db')
app.use(express.json());
var cors = require('cors');
app.use(cors());
app.use('/api/user', userRouter);
app.listen(PORT, () => {
    console.log("CONNECTED");
});