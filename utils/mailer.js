const nodeMailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporterDetails = smtpTransport({
  host: "mail.arman.ir",
  port: 465,
  secure: true,
  auth: {
    user: "rmn.mokhtariigmail.com",
    pass: "xd123456",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.sendEmail = (email, fullname, subject, message) => {
  const transporter = nodeMailer.createTransport(transporterDetails);
  transporter.sendMail({
    from: "rmn.mokhtariigmail.com",
    to: email,
    subject: subject,
    html: `<h1> سلامی بر دنیا ${fullname}</h1>
            <p>${message}</p>`,
  });
};
