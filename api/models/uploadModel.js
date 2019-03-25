const mongoose = require('mongoose');

const uploadSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    files_id: mongoose.Schema.Types.ObjectId,
    upload_by: { type: String, ref: 'User', required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },

    delete_by: { type: String, ref: 'User' },
    delete_date: { type: Date },
    parser_errors: { type: String },
    last_modified: { type: Date }

});

module.exports = mongoose.model('Upload', uploadSchema);
