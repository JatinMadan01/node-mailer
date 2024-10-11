const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/form.html'));
});


app.post('/send', (req, res) => {
    const { name, email, message } = req.body;

   
    if (!name || !email || !message) {
        return res.status(400).send('All fields are required.');
    }

 
    let transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: 'your-email@gmail.com', 
            pass: 'your-email-password', 
        },
    });


    let mailOptions = {
        from: email, 
        to: 'recipient-email@gmail.com', 
        subject: 'Contact Form Submission',
        text: `You have received a new message from ${name} (${email}):\n\n${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error sending email. Please try again later.');
        }
        console.log('Email sent: ' + info.response);
        res.send('Email sent successfully!');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
