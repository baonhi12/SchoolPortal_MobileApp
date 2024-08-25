const { default: mongoose } = require("mongoose");

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log(`MongoDB connected successfully`);
})

.catch((error) => {
    console.log(`Database error`);
    throw new Error(error);
});