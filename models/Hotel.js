const mongoose = require('mongoose');

const HotelSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    image: {
        type: String,
        required: true
    },
    contactNo:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    minPrice:{
        type: String,
        required: true 
    }
    ,
    maxPrice:{
        type: String,
        required: true
    },
    mapLocation: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Hotel', HotelSchema);
