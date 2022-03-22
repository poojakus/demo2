var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChatTemplateModel = new Schema({
    text: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Number
    }
});

module.exports = mongoose.model('ChatTemplate', ChatTemplateModel);