const express = require('express');
const User = require('./model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const auth = require('./Middleware/auth');
require('dotenv').config(); // To use environment variables

const app = express();
app.use(express.json());
app.use(cookieParser());

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true, // Allow cookies to be sent with requests
}));

const PORT = 8080;

// MongoDB connection string
const dbURI = 'mongodb://localhost:27017/RestAPi_Data';

// Connect to the MongoDB database
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Routes
app.post("/register", async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        if (!(firstname && lastname && email && password)) {
            return res.status(400).send('All fields are required');
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'your_jwt_secret', // Use environment variable for JWT secret
            { expiresIn: '4h' }
        );

        user.token = token;
        user.password = undefined;

        res.status(201).json(user);

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).send('Email and password are required');
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid email or password');
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'your_jwt_secret', // Use environment variable for JWT secret
            { expiresIn: '4h' }
        );

        user.token = token;
        user.password = undefined;

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        };
        res.status(200).cookie("token", token, options).json({
            success: true,
            token,
            user
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// app.get("/dashboard", auth, (req, res) => {
//     res.send('Welcome to Dashboard');
// });

app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
});
