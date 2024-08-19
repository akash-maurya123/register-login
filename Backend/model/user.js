// model/user.js

const mongoose = require('mongoose');

// Create a schema for the User

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    }
}, {
    timestamps: true
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
