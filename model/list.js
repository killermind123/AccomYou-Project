const mongoose = require('mongoose');
const Review = require('./reviews.js');
const User = require('./user.js');
const Schema= mongoose.Schema;

const listschema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    image: {
    filename: {
        type: String,
        
    },
    url: {
        type: String,
        default: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'
    }
},
    price: {
        type: Number
    },
    location: {
        type: String
    },

    country: {
        type: String
    },

    review: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },

               
    },

    facilities: {
            type: [String],
            enum: ['Wifi', 'Air Conditioning', 'Kitchen', 'Parking', 'Pool', 'Gym',]
        }



});

listschema.post('findOneAndDelete', async function(listing) {
    if(listing){
        await Review.deleteMany( {
            _id: {
                $in: listing.review}})
    }
});


const Listing = mongoose.model('Listing', listschema);

module.exports = Listing;