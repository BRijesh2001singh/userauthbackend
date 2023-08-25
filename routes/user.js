const router = require('express').Router();
const { createUser, signin, verifyEmail, getuser } = require('../controllers/user');
const { Validator, validate } = require('../middlewares/datavalidator');
const user = require('../model/user');
const verification = require('../model/verification');
router.get("/getuser", getuser);
router.post("/create", Validator, validate, createUser);
router.post("/signin", signin);
router.post('/verify-email', verifyEmail)
module.exports = router;