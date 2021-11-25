const fs = require('fs');
const path = require('path');
const Place = require('../model/places');
const { validationResult } = require('express-validator');


// CREATE PLACE 
const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if(req.file){
            fs.unlink(path.join(__dirname,"..",req.file.path), function (err) {
                console.log(err);
              });
            }
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        title,
        description,
        address,
    } = req.body;

    const createplace = {
        title,
        description,
        location: {
            lat: 234.56,
            lng: 2345.66
        },
        address,
        creator: req.user.id,
        image: req.file.path
    };
    const place = new Place(createplace);


    try {
        await place.save()
        res.status(201).json({ place: place })
    } catch (error) {
        res.status(500).send(error);
    }
};

// UPDATE PLACE BY THE ID

const updatePlaceById = async (req, res) => {
    const placeId = req.params.placeId;
    const { description, title } = req.body;

    // ERRORS HANDLER
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // DEFINE THE FIELDS TO UPDATE 
    const updateField = ['title', 'description'];
    const keys = Object.keys(req.body);
    const verifyFields = keys.every((e) => updateField.includes(e));

    // s
    if (!verifyFields) {
        return res.status(400).json({ errors: [{ msg: "Invalid update fields!" }] })
    }

    try {
        const place = await Place.findById(placeId);
        if (!place) {
            return res.status(404).json({ errors: [{ msg: "No place for given place Id" }] })
        }
        console.log(req.user._id, place.creator)
        console.log( req.user.id !== place.creator)
        // checking the authorize of user 
        if(req.user._id.toString() !== place.creator.toString()){
            return res.status(401).json({ errors: [{ msg: "Your are not allowed to edit!" }] })
        
        }
        place.title = title;
        place.description = description;
        await place.save()
        res.status(200).json({ place })
    } catch (error) {
        res.status(500).send()
    }

};

// DELETE PLACE BY THE ID 
const deletePlaceById = async (req, res, next) => {
    const placeId = req.params.placeId;
    // before the delete the place we have to delete the image of the place
    try {
        const place = await Place.findById(placeId);
        
        if (!place) {
            res.status(404).json({
                errors: [{
                    msg: "No place found for the given the id"
                }]
            })
            return;
        }
        // checking the authorize of user 
        if(req.user._id.toString() !== place.creator.toString()){
            return res.status(401).json({ errors: [{ msg: "Your are not allowed to edit!" }] })
        
        }
        await place.remove();
        res.status(200).json({ place });
    } catch (error) {
        console.log(error)
        res.status(500).json({ errors: [{ msg: "something went Wrong, Try again!" }]})
    }
}
// GET PLACE BY THE ID 
const getPlaceById = async (req, res) => {
    const placeId = req.params.id;
    try {
        const place = await Place.findById(placeId).populate('creator');
        if (!place) {
            res.status(404).send({ errors: [{ msg: "Place id not found!" }] });
            return;
        }
        res.status(200).send({ place })

    } catch (error) {
        res.status(500).send({ errors: [{ msg: "something went wrong. please try again" }] })
    }
};

// GET PLACES BY FOR THE SPECFIC USER USING THE USER ID 
const getPlacesByUserId = async (req, res) => {
    const userId = req.params.uid;
    try {
        const place = await Place.find({ creator: userId }).populate('creator');
        res.json({ place })
    } catch (error) {
        res.status(500).send({errors: [{msg: "Something went wrong, Please try again"}]});
    };
};


module.exports = {
    createPlace,
    updatePlaceById,
    deletePlaceById,
    getPlaceById,
    getPlacesByUserId
};

