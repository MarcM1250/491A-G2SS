const mongoose = require('mongoose');

const downloadSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    upload_id: mongoose.Schema.Types.ObjectId,
    download_via: { type: String, required: true }, // download using API or Webapp
    download_date: { type: Date, required: true }, 
    download_by: { type: String, ref: 'Account', required: true } // the account that downloaded the file
});

module.exports = mongoose.model('Download', downloadSchema);