
const nodemailer = require('nodemailer');

const SendEmail = async (mailTo, subject, template) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'designerrocky24@gmail.com',
            pass: 'qtbe ugme aeqc wtth'
        }
    });

    let emailOption = {
        from: 'eBazar <designerrocky24@gmail.com>',
        to: mailTo,
        subject: subject,
        html: template
    };

    return transporter.sendMail(emailOption);
}
module.exports = SendEmail;