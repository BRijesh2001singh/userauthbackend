const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const verificationtokenschema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: 3600,
        default: Date.now(),
    }
});
//before saving our user we need to run this function so we use .pre
verificationtokenschema.pre('save', async function (next) {
    if (this.isModified('token')) {
        const hash = await bcrypt.hash(this.token, 8);
        this.token = hash;
    }
    next();
});
verificationtokenschema.methods.compareOTP = async function (token) {
    const result = await bcrypt.compareSync(token, this.token);
    return result;
}
module.exports = mongoose.model('VerificationToken', verificationtokenschema);
