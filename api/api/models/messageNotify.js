var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageNotifyModel = new Schema({
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

module.exports = mongoose.model('MessageNotify', MessageNotifyModel);