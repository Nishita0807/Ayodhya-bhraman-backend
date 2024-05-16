const express = require('express');
const path = require('path');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const clc = require('cli-color');
require('dotenv').config();

const app = express();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json()); // Add this line to parse JSON bodies
app.use(cors({
    origin: ["https://ayodhya-bhraman-frontend.vercel.app"],
    methods: ['POST', 'GET'],
    credentials: true,
}));


mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})
.then(() => {
    console.log(clc.bgYellowBright('MongoDB connected successfully'));
})
.catch((err) => {
    console.error(clc.bgRed('Failed to connect to MongoDB:', err));
});

// User Model
const User = require('./models/User');

// Register Route
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({
            username,
            password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(payload, 'secretKey', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Middleware to verify token
// Middleware to verify token
const authMiddleware = (req, res, next) => {
    if (req.method === 'POST') { // Only authenticate POST requests
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }
        try {
            const decoded = jwt.verify(token, 'secretKey');
            req.user = decoded.user;
            next();
        } catch (err) {
            res.status(401).json({ msg: 'Token is not valid' });
        }
    } else {
        next(); // Skip authentication for GET requests
    }
};


// Routes
app.use('/api/hotels', authMiddleware, require('./routes/hotels'));
app.get('/',(req,res)=>{
    res.status(200).send("hello from server");
})
// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
