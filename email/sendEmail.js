const nodemamailer = require('nodemailer');

const user = 'testandodev2021@gmail.com'
const pass = '12345678*abc'

const sendEmail = function(to, code) {

    const transporter = nodemamailer.createTransport({
        host:'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user, pass },
        tls: {
            rejectUnauthorized: false
        }
    })

    transporter.sendMail({
        from: user,
        to: to,
        replyTo: '',
        subject: 'Olá tudo bem? Seu código é...',
        text: code                             
    }).then(info => {
        console.log(info)
    }).catch(error => {
        console.log(error)
        // res.send(error)
    })

}

module.exports = sendEmail;