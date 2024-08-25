const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const bcrypt = require('bcrypt');

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "yna050897@gmail.com",
      pass: "nujgzmgttbuwljwj",
    },
});
  
async function mailer(receiveEmail, code) {
    const info = await transporter.sendMail({
      from: '"Heyy 👻" <yna050897@gmail.com>', // sender address
      to: `${receiveEmail}`, // list of receivers
      subject: "Signup Verification", // Subject line
      text: `Your Verification Code is ${code}`, // plain text body
      html: `<b>Your Verification Code is ${code}</b>`, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
}


router.post('/verify', async (req, res) => {
    // console.log('verify req body - ', req.body);
    // const { name, email, mobile, password } = req.body;
    
    const { name, email, mobile, password, role } = req.body;
    console.log('verify req body - ', req.body);
    
    if (!name || !email || !mobile || !password || !role) {
        return res.status(422).send({ error: "Please add all the fields" });
    }

    User.findOne({email: email}).then(async (savedUser) => {
        if (savedUser) {
            return res.status(422).send({ error: "Invalid Credentials" });
        }
        try {
            let verifyCode = Math.floor(100000 + Math.random() * 900000);
            let user = [{ name, email, mobile, password, role, verifyCode }];
            await mailer(email, verifyCode);
            res.send({message: 'Verification code sent to your email', userData: user});
            // console.log(userData);
            
        }
        catch (err) {
            console.log(err);
            return res.status(422).send({error: err.message});
        }
    });
});

router.post('/signup', async (req, res) => {
    console.log('Received data - ', req.body); 
    const { name, email, mobile, password, role } = req.body;
    console.log('Extracted fields - ', { name, email, mobile, password, role });
    if (!role) {
        console.log('Error: role is missing');
        return res.status(400).send({ error: 'Role is required' });
    }

    const user = new User({ name, email, mobile, password, role });

    try {
        await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.send({ message: 'User registered successfully!', token });
    } catch (err) {
        console.log(err);
        return res.status(422).send({ error: err.message });
    }
});


router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).send({ error: 'Must provide email and password' });
    }
    const savedUser = await User.findOne({ email: email });

    if (!savedUser) {
        return res.status(422).send({ error: 'Invalid email or password' });
    }

    try {
        bcrypt.compare(password, savedUser.password, (err, result) => {
            if (result) {
                // console.log('Password matched');
                // const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
                // res.send({ token });

                // add role to the token
                const token = jwt.sign({ _id: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET);
                res.send({ token, role: savedUser.role });
                console.log('Login success');
            } else {
                console.log('Password incorrect');
                return res.status(422).send({ error: 'Invalid email or password' });
            }
        });
    } catch (err) {
        console.log(err); 
        //return res.status(422).send({ error: 'Invalid email or password' });
    }
});

 
module.exports = router;