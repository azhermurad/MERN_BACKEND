const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// we have define the types 

const userSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true, minlength: 7 },
    image: { type: String, required: true },
    tokens: [{ token: { type: String, required: true } }]
});

userSchema.pre('save', async function () {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    };
});
// generated the token for the user authrzation to access the router
userSchema.methods.generateAuthtoken = async function () {
    const user = this;
    const token = jwt.sign({ id: user.id }, "secretkey", { expiresIn: '1hr' });
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token;
};

// DEFINE THE STATIC METHOD WHICH IS HELP FOR US IN THE LOGUN THE USER FROM THE DATABASE
userSchema.statics.findByCredentials = async (res, email, password) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        res.status(400).json({ errors: [{ msg: "No user exits by this email" }] })
        return;
    };
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400).json({ errors: [{ msg: "Invalid password, try again" }] })
        return;
    };
    return user;
};

// VIRTUAL WHICH IS THE MOST MOST IMPORTANT PART OF MONGOBD 
userSchema.virtual('places', {
    ref: "Place",
    localField: "_id",
    foreignField: "creator",
})

// method to hide the fields 
// userSchema.methods.toJSON = function (params) {
//     var obj = this.toObject(); //or var obj = this;
//     delete obj.password;
//     return obj;
// }

// add this in your schema if vritual is not work
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true,
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.tokens;
        // ret.places.forEach(element => {
        //     //  we can also delete the element from here to control the flow of the program
        // });
        return ret;
      } });

const User = mongoose.model("User", userSchema);
module.exports = User;




