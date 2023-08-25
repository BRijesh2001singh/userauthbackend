const nodemailer = require('nodemailer');
exports.generateOTP = () => {
  let otp = '';
  for (let i = 0; i <= 3; i++) {
    const randomOtp = Math.round(Math.random() * 9)
    otp = otp + randomOtp;
  }
  return otp;
}
exports.generateMail = () => transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});
//for generating email templates
exports.emailtemplate = (code, id) => {
  return `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">BOOK STORE</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Thank you for choosing Book Store. Use the following OTP to complete your Sign Up procedures. OTP is valid for  1 hour</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${code}</h2>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">Please copy this id ${id}</h2>
      <p style="font-size:0.9em;">Regards,<br />Book Store</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Book Store Inc.</p>
        <p>Delhi</p>
        <p>India</p>
      </div>
    </div>
  </div>`
};
exports.welcomeEmail = user => {
  return `<h1>${user} has been Verified, WELCOME! </h1>`
}