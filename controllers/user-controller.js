const path = require('path');
const fs = require('fs');
const User = require('../model/user');
const { validationResult } = require('express-validator');



const createUser = async (req, res) => {
    console.log(req.body,req.file)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if(req.file){
            fs.unlink(path.join(__dirname,"..",req.file.path), function (err) {
                console.log(err);
              });
            }
        return res.status(400).json({ errors: errors.array() });
    }
    // check wheather the file is empty 
    if(!req.file){
        return res.status(400).json({ errors: "Please uplaod  a image!" });
    }
    try {
        const emailExit = await User.findOne({ email: req.body.email });
        if (emailExit) {
            if(req.file){
                fs.unlink(path.join(__dirname,"..",req.file.path), function (err) {
                    console.log(err);
                  });
                };
            res.status(400).json({ errors: [{ msg: "Email already exist,Try again with other email Address" }] })
            return;
        };


        const userFields = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            image: req.file.path
        };

        //

        const user = new User(userFields);
        await user.save();
        const token = await user.generateAuthtoken();
        user.places = []
        res.status(201).json({ user, token });
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByCredentials(res, email, password)
        if (user) {
            const token = await user.generateAuthtoken();
            res.status(200).json({ user,token });
        }
    } catch (error) {
        res.status(500).json({ errors: [{ msg: "Something went wrong, try again" }] })
    }
};

// GET ALL THE USER FROM THE DATABASE  
const getAllUsers = async (req, res) => {
    try {
        const user = await User.find({}).populate('places');
        res.status(200).json({ user });

    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }

}
module.exports = {
    createUser,
    loginUser,
    getAllUsers
};