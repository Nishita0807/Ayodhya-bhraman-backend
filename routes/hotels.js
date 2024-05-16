const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Hotel = require('../models/Hotel');

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Add a new hotel with image upload
router.post('/', upload.single('image'), async (req, res) => {
    const { name, contactNo, category, minPrice, maxPrice, mapLocation } = req.body;
    const image = req.file ? req.file.path : ''; // File path of the uploaded image
    try {
        const newHotel = new Hotel({
            name,
            image,
            contactNo,
            category,
            minPrice,
            maxPrice,
            mapLocation
        });
        const hotel = await newHotel.save();
        res.json(hotel);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all hotels
router.get('/', async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
