const express = require('express');
const upload = require('../middlewares/upload-image');
const { addPlaceValidation, updatePlaceValidation } = require('../helpers/validations/placeValidations');


const router = express.Router();
const {
    createPlace,
    getPlaceById,
    getPlacesByUserId,
    updatePlaceById,
    deletePlaceById
} = require('../controllers/places-controller');
const auth = require('../middlewares/auth');
const Place = require('../model/places');


// route for the place
router.get("/places/:id", getPlaceById);
router.get("/places/user/:uid", getPlacesByUserId);
router.get("/all/places",async (req, res, next)=>{
     const places = await  Place.find({}).populate('creator');
     res.json({places});
})
router.post("/places", auth,upload.single('image'),addPlaceValidation, createPlace,(error, req, res, next)=>{
    res.status(400).send({ errors: [{ msg: error.message}]});
});
// route for the user authoriazati
router.use(auth);
router.patch('/places/:placeId', updatePlaceValidation, updatePlaceById);
router.delete('/places/:placeId', deletePlaceById);


module.exports = router;

