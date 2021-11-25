const { check } = require('express-validator');

const addUserValidation = [
    check('name').trim().not().isEmpty()
        .withMessage('Name is required'),
    check('email').isEmail()
        .withMessage('please provide a valid email address'),
    check('password').trim().isLength({min: 7})
        .withMessage('password must be 7+ chars long'),
]


module.exports = {
    addUserValidation
}