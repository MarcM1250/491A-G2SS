const mongoose = require('mongoose');

const uploadSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    description: { type: String, required: true },
    upload_date: {type: Date, required: true},
    upload_by: { type: String, ref: 'Account', required: true },
    filename: {type: String, required: true},
    file_size: {type: Number, required: true},
    last_modified: { type: Date },
    delete_date: { type: Date },
    checksum: {type: String},
    delete_by: { type: String, ref: 'Account' },
    parser_status: { type: JSON}
});

module.exports = mongoose.model('Upload', uploadSchema);
