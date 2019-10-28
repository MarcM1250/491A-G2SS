const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    organization: { type: String },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    //delete_permission: { type: Boolean, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user', required: true },
    last_login_attempt: { type: Date, default: Date.now(), required: true },
    failed_login_attempts: { type: Number, min: 0, max:3, default: 0, required: true}
});

module.exports = mongoose.model('Account', accountSchema);