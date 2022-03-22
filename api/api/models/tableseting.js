var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TableSetingModel = new Schema({
    key: {
        type: String,
        enum: ['pool', 'players'],
        required: true
    },
    type: {
        type: String,
        enum: ['public', 'private'],
        required: true
    },
    is_active: {
        type: String,
        enum: ['Y', 'N'],
    },
    value: {
        type: Number,
        required: true,
        default: 0
    },    
});

var TableSeting = mongoose.model('TableSeting', TableSetingModel);

module.exports = {
    TableSeting
};