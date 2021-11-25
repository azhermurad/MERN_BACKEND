const express = require('express');
const path = require('path');
const userRoute = require('./routers/users');
const placeRoute = require('./routers/places');
const cors = require('cors')
require('./config/mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

// PARSTING INCOMING JSON IN TO OBJECT ALTERNATIVE IS BODYPARSER
app.use(express.json()); 

// TO HEANDLE CORS ERRORS ALTERNATIVE IS USE MIDDLEWARE WITH THE RESPONSE 
app.use(cors());

// REGESTER ALL THE ROUTES;

// this route is use for the static file
const staticFilePath = path.join(__dirname,"./uploads/images");
app.use("/uploads/images",express.static(staticFilePath));
app.use(userRoute);
app.use(placeRoute);
app.use("*", (req, res)=> {
    res.send("not found")
});

// appListen us use to handle all the route of the server
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});



