const mongoose = require('mongoose');

const uploadSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    description: { type: String, required: true },
    upload_date: { type: Date, required: true },
    upload_by: { type: String, ref: 'Account', required: true },
    filename: { type: String, required: true }, // original name of the uploaded file
    file_size: { type: Number, required: true },
    last_modified: { type: Date },
    checksum: { type: String }, // MD5 of the uploaded file
    delete_date: { type: Date }, 
    delete_by: { type: String, ref: 'Account' },
    parser_status: { type: JSON } // file validation results
});

module.exports = mongoose.model('Upload', uploadSchema);
