const express = require('express');
const router = express.Router();
const { addUserValidation } = require('../helpers/validations/userValidations');
const upload = require('../middlewares/upload-image');

const {
    createUser,
    loginUser,
    getAllUsers
} = require('../controllers/user-controller');


router.post("/users", upload.single("image"), addUserValidation, createUser, (error, req, res, next) => {
    res.status(400).send(
        {
            errors: [{ msg: error.message }]
        })
});

router.post("/users/login", loginUser);
router.get("/users", getAllUsers)   

module.exports = router;