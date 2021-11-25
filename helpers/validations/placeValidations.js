const { check, validationResult } = require('express-validator');

const addPlaceValidation = [
    check('title').trim().isLength({ min: 7 })
        .withMessage('The title must be 7+ chars long'),
    check('description').trim().not().isEmpty()
        .withMessage('description is required'),
    // check('image').trim().not().isEmpty()
    //     .withMessage('image is required'),
    check('address').trim().not().isEmpty()
        .withMessage('Address is required')
]

const updatePlaceValidation = [
    check('title').trim().isLength({ min: 7 })
        .withMessage('The title must be 7+ chars long'),
    check('description').trim().not().isEmpty()
        .withMessage('description is required'),

]

module.exports = {
    addPlaceValidation,
    updatePlaceValidation
}