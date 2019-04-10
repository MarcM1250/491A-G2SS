const mongoose = require('mongoose');

const downloadSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    upload_id: mongoose.Schema.Types.ObjectId,
    // download_via: {type: String, required: false},
    download_date: { type: Date, required: true },
    download_by: { type: String, ref: 'Account', required: true }
});

module.exports = mongoose.model('Download', downloadSchema);