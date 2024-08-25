const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
require('dotenv').config();

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    // console.log('authorization - ', authorization);
    if (!authorization) {
        return res.status(401).send({ error: "You must be logged in, key not given" });
    }

    const token = authorization.replace("Bearer ", "");
    // console.log('token - ', token);
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: "You must be logged in, token not valid" });
        }

        const { _id } = payload;
        User.findById(_id).then(userData => {
            req.user = userData;
            next();
        });
    });
}