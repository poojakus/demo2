var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PromoModel = new Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean
    },
    created_at: {
        type: Number
    }
});

module.exports = mongoose.model('Promo', PromoModel);