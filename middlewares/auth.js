
const jwt = require('jsonwebtoken');
const User = require('../model/user');



// auth function check weather the user is authorize or unauthorize
const auth = async (req, res, next) => {

    try {
     const token = req.headers.authorization.split(' ')[1];
     const decoded = jwt.verify(token,"secretkey"); 
     const user = await User.findOne({_id: decoded.id,'tokens.token': token})

     if(!user){
         throw new Error();
     };
     req.user= user;
     next();
 } catch (error) {
    res.status(401).json({errors: [{msg: "Please Authenticate."}]})
 };
}; 

module.exports = auth;


// now we have to deploy the react app to  the heroku 

