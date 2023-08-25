const User = require('../model/user');
const { sendError } = require('../utils/helper');
const jwt = require("jsonwebtoken");
const { generateOTP, generateMail, emailtemplate, welcomeEmail } = require('../utils/mail');
const VerificationToken = require('../model/verification');
const { isValidObjectId } = require('mongoose');
//create user
exports.createUser = async (req, res) => {
    const { name, email, password } = req.body
    const usercheck = await User.findOne({ email })
    if (usercheck) sendError(res, "This Email is already present");
    else {
        const newUser = new User({
            name,
            email,
            password
        });

        // generating an otp
        const otp = generateOTP();
        const verificationtokenvar = new VerificationToken({
            owner: newUser._id,
            token: otp,
        });
        await verificationtokenvar.save()
        await newUser.save()
        const newuserid = newUser._id;
        //sending mail
        generateMail().sendMail({
            from: 'emailverification@gmail.com',
            to: newUser.email,
            subject: "verify Your email account",
            html: emailtemplate(otp, newuserid),
        })
        res.send(newUser)
    }
}
//signin
exports.signin = async (req, res) => {
    const { email, password } = req.body;
    if (!email.trim() || !password.trim())
        return sendError(res, "email/password missing");
    const user = await User.findOne({ email })
    if (!user) return sendError(res, 'Email not found');
    const passmatch = await user.comparePassword(password);
    if (!passmatch) return sendError(res, 'password does not match');
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
    res.json({ success: true, user: { name: user.name, email: user.email, id: user._id, token: token } });
}

//verifyEmail
exports.verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    if (!userId || !otp.trim()) return sendError(res, "Invalid request,missing parameters")

    if (!isValidObjectId(userId)) return sendError(res, "Invalid user ID")


    const user = await User.findById(userId)
    if (!user) return sendError(res, 'sorry user not found!');
    if (user.verified) return sendError(res, 'This account is already verified');
    const token = await VerificationToken.findOne({ owner: user._id });
    if (!token) return sendError(res, 'User not found');

    const isMatched = await token.compareOTP(otp);
    if (!isMatched) return sendError(res, 'Token Not matched');
    //deleting token after verification
    user.verified = true;
    await VerificationToken.findByIdAndDelete(token._id);
    await user.save();
    generateMail().sendMail({
        from: 'bookStore@gmail.com',
        to: user.email,
        subject: "Welcome Email",
        html: welcomeEmail(user.name),
    });
    res.json({ success: true, message: "your email is verified ", user: { name: user.name } })
};
exports.getuser = async (req, res) => {
    let userinfo;
    try {
        userinfo = await User.find();
        res.status(200).json({ userinfo });
    }
    catch (error) {
        console.log(error);
    }
};