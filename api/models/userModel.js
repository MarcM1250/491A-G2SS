const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    /*
    organization: {type: String},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true}
    */
});

module.exports = mongoose.model('User', userSchema);