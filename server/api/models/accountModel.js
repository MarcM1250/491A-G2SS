const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    organization: { type: String },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    delete_permission: { type: Number, required: true }
});

module.exports = mongoose.model('Account', accountSchema);