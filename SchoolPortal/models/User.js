const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const router = require('../router/authRoutes');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true  
    },
    password: {
        type: String,
        required: true
    }, 
    // add role
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student', 'parent', 'guest'],
        required: true,
    },  
});

userSchema.pre('save', async function(next) {
    const user = this;
    console.log('Just before saving & before hashing', user.password);
    if(!user.isModified('password')) {
        return next();
    }
    user.password = await bcrypt.hash(user.password, 8);
    console.log('Just before saving & after hashing', user.password);
    next();
});


module.exports = mongoose.model('User', userSchema);