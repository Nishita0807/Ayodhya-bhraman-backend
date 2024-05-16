const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');

// Add a new hotel
router.post('/', async (req, res) => {
    const { name, contactNo, category, minPrice, maxPrice, mapLocation } = req.body;
    try {
        const newHotel = new Hotel({
            name,
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
