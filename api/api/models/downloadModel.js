const mongoose = require('mongoose');

const downloadSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    upload_id: mongoose.Schema.Types.ObjectId,
    download_by: { type: String, ref: 'User', required: true },
    download_date: { type: Date, required: true }
});

module.exports = mongoose.model('Download', downloadSchema);