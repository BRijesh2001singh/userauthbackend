const { check, validationResult } = require('express-validator');
exports.Validator = [
    check("name").
        trim()
        .not()
        .isEmpty()
        .withMessage("Name is missing"),
    check('email').normalizeEmail()
        .isEmail().withMessage("Email is invalid"),
    check('password').trim()
        .not()
        .isEmpty()
        .withMessage("Password is missing")
        .isLength({ min: 8, max: 20 })
        .withMessage("Password length must be 8 to 20 characters"),
];


exports.validate = (req, res, next) => {
    const error = validationResult(req).array()
    if (!error.length) return next()
    res.status(400).json({ success: false, error: error[0].msg })
};
