var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserMessageModel = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        minlength: 1,
        maxlength: 20
    },
    content: {
        type: String,
        minlength: 1,
        maxlength: 300
    },
    created_at: {
        type: String
    }
});

module.exports = mongoose.model('UserMessage', UserMessageModel);