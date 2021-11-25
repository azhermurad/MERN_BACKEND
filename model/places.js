
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const placeSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        },
        creator: {
            type: mongoose.ObjectId,
            required: true,
            ref: "User",
        }
    },
    { timestamps: true }
);
placeSchema.post("remove", function () {
 const place = this;
 fs.unlink(path.join(__dirname,"..",place.image), function (err) {
    console.log(err);
  });
})
const Place = model('Place', placeSchema);
module.exports = Place;

