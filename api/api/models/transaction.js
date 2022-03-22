var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var TransactionModel = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    txn_amount: {
        type: Number,
        required: true,
        default: 0
    },
    txn_win_amount: {
        type: Number,
        required: true,
        default: 0
    },
    txn_main_amount:{
        type: Number,
        required: true,
        default: 0    
    },
    txn_id: {
        type: String,
        default: ""
    },
    order_id: {
        type: String,
        required: true
        // unique: true
    },
    created_at: {
        type: String
    },
    main_wallet_closing: {
        type: Number,
        default: 0
    },
    win_wallet_closing: {
        type: Number,
        default: 0
    },
    transaction_type: {
        type: String,
        enum: ['C', 'D'], // C = Credit, D = Debit
        default: "C"
    },
    checksum:{
        type: Schema.Types.Mixed
    },
    resp_msg:{
        type: String,
        default: ""
    },
    txn_mode: {
        type: String,
        enum: ['G', 'P', 'A','B', 'R','C', 'O', 'REF','SB','SW'] //G = Game, P = Paytm, A = By Admin,  B = Bonus, R = Refund, REF = Referral, O =  Other , SB = Signup bonus    
    },
    is_status: {
        type: String,
        enum: ['P', 'S', 'F'], // P = Pending, S = Success, F = Faild
        default: 'P'
    }
});

var Transaction = mongoose.model('Transaction', TransactionModel);

module.exports = {
    Transaction
};

// var mongoose = require('mongoose'),
//     Schema = mongoose.Schema;

// const Counter = require('./counter');


// var TransactionModel = new Schema({
//     user_id: {
//         type: Schema.Types.ObjectId,
//         required: true,
//         ref: 'User'
//     },
//     txn_amount: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     txn_win_amount: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     txn_main_amount:{
//         type: Number,
//         required: true,
//         default: 0    
//     },
//     txn_id: {
//         type: String,
//         default: ""
//     },
//     order_id: {
//         type: String,
//         required: true
//         // unique: true
//     },
//     created_at: {
//         type: String
//     },
//     main_wallet_closing: {
//         type: Number,
//         default: 0
//     },
//     win_wallet_closing: {
//         type: Number,
//         default: 0
//     },
//     transaction_type: {
//         type: String,
//         enum: ['C', 'D'], // C = Credit, D = Debit
//         default: "C"
//     },
//     resp_msg:{
//         type: String,
//         default: ""
//     },
//     txn_mode: {
//         type: String,
//         enum: ['G', 'P', 'A'] //G = Game, P = Paytm, A = By Admin    
//     },
//     is_status: {
//         type: String,
//         enum: ['P', 'S', 'F'], // P = Pending, S = Success, F = Faild
//         default: 'P'
//     }
// });

// TransactionModel.pre('save', function(next) {
//     var doc = this;
//     console.log("PRE SAVE",doc);
//     Counter.findByIdAndUpdate({_id: 'order_id_inc'}, {$inc: { seq: 1} }, { upsert: true , new: true}, function(error, count)   {
//         if(error)
//             return next(error);
//         doc.order_id = count.seq || 1;
//         console.log("UPDATED SAVE",doc);
//         next();
//     });
// });

// var Transaction = mongoose.model('Transaction', TransactionModel);

// module.exports = {
//     Transaction
// };