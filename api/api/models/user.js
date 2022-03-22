var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const config = require('./../../config');
var UserModel = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    numeric_id: {
        type: Number,
        required: true,
        unique: true
    },
    customer_id: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    state: {
        type: String,
        default: ""
    },
    age: {
        type: Number,
        default: 18
    },
    password: {
        type: String
    },
    mobile_no: {
        country_code: {
            type: String
        },
        number: {
            type: String,
            trim: true
        }
    },
    profilepic: {
        type: String,
        trim: true
    },
    referral: {
        referral_code: String,
        referred_by: String,
        amount: {
            type: Number,
            default: 0
        },
        matches: {
            type: Number,
            default: 0
        },
        first_ref: {
            type: Boolean,
            default: false
        }
    },
    created_at: {
        type: String
    },
    last_login: {
        type: String
    },
    main_wallet: {
        type: Number,
        default: 0
        // default: config.signup_bonus
    },
    win_wallet: {
        type: Number,
        default: 0
    },
    app_version: {
        type: String
    },
    facebook_id: {
        type: String,
        default: ''
    },
    device_id: {
        type: String,
        trim: true
    },
    device_type: {
        type: String,
        enum: ['ios', 'android']
    },
    otp: {
        value: {
            type: String
        },
        send_attempts: {
            type: Number,
            default: 0
        },
        continuous_false_attempts: {
            type: Number,
            default: 0
        },
        expired_at: {
            type: String
        }
    },
    otp_verified: {
        type: Boolean,
        default: false
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    email_token: {
        value: {
            type: String
        },
        expired_at: {
            type: String
        }
    },
    reset_token: {
        value: {
            type: String
        },
        expired_at: {
            type: String
        }
    },
    password: {
        type: String
    },
    is_game_disclaimer: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    onesignal_id: {
        type: String,
        default: ''
    },
    push_enable: {
        type: Boolean,
        default: true
    },
    ref_bonus_passed: {
        type: Boolean,
        default: false
    },
    user_device: {
        name: {
            type: String
        },
        model: {
            type: String
        },
        os: {
            type: String
        },
        processor: {
            type: String
        },
        ram: {
            type: String
        }
    },
    tokens: [
        {
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
    ]
});

var User = mongoose.model('User', UserModel);

module.exports = {
    User
};
