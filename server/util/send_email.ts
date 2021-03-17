import nodemailer from "nodemailer";
const enviromentVars = require("dotenv").config().parsed;

const send_email = async (address: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: enviromentVars._email_name_.toString(),
      pass: enviromentVars.__password__.toString(),
    },
  });
  let email_sent = await transporter.sendMail({
    from: enviromentVars._email_name_.toString(),
    to: address,
    subject: "Welcome To Instagram Clone!",
    html: `<center>
      <h1> Welcome To Instagram Clone</h1>
      <h2>Get Started With Posting in Instagram Clone!</h2>
      <a href="https://instagram-clone.raakeshpatel.com/">Take Me There!</a>
      </center>
      `,
  });
  if (email_sent) return true;
};

export default send_email;
