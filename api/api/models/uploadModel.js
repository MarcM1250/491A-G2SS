const mongoose = require('mongoose');

const uploadSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    files_id: mongoose.Schema.Types.ObjectId,
    subject: { type: String, required: true },
    description: { type: String, required: true },
    upload_date: {type: Date, required: true},
    upload_by: { type: String, ref: 'Account', required: true },
    // filename: {type: String},
    // file_size: {type: Number},

    delete_date: { type: Date },
    delete_by: { type: String, ref: 'Account' },
    last_modified: { type: Date },
    parser_errors: { type: String }

});

module.exports = mongoose.model('Upload', uploadSchema);
