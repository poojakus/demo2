var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ConfigModelData = new Schema({
    key: {
        type: String,
        required: true
    },
    value: {
        type: Array,
        default: []
    },
    created_at:{
        type: Date,
        default: Date.now,
    },
    last_updated_at:{
        type: Date, 
        default: Date.now,
    }
});

var ConfigModel = mongoose.model('ConfigModel', ConfigModelData);

module.exports = {
    ConfigModel
};