const dotenv = require('dotenv');
dotenv.config();

const config = function () {
    this.project_name = process.env.PROJECT_NAME;
    this.port = process.env.PORT;
    this.pre = process.env.PRE;
    this.path_types = {
        absolute: 0,
        relative: 1
    };
    this.path = this.path_types.relative; // [absolute,relative]

    this.dummyMoves = process.env.dummyMoves || false;
    this.masterPassword = 'cap#admin53';

    switch (process.env.NODE_ENV) {
        case 'local':
            this.dbConnectionUrl = process.env.MONGO_LOCAL;
            break;
        case 'staging':
            this.dbConnectionUrl = process.env.MONGO_STAG;
            break;
        case 'production':
            this.dbConnectionUrl = process.env.MONGO_PROD;
            break;
        case 'development':
            this.dbConnectionUrl = process.env.MONGO_DEV;
            break;
        default:
            this.dbConnectionUrl = process.env.MONGO_LOCAL;
    }

    this.OPT_EXPIRED_IN_MINUTES = 15;
    this.EMAIL_LINK_EXPIRED_IN_MINUTES = 30;

    this.cryptrSecret = 'sandfgsh3543dgdg@2323sdngshdsvdvsdff';
    this.apiSecret = '4hg4d567iufbzijdfb98ewr4804j';
    this.sessionSecret = 'topSecretSessionKey';

    this.reset_email = {
        host: 'smtp.sendgrid.net', //smtp.gmail.com
        port: 587,
        secure: false,
        auth: {
            user: 'apikey', //help@ludocircle.com
            pass: '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' //hludnlhqptgzctqg
        }
    };

    this.support_email = 'help@powerludo.com';

    this.AWS_S3_BUCKET = {
        key: 'AKIAXOQKE5WDLDX5VEIJ',
        secret: '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',
        name: 'power-ludo',
        region: 'eu-west-2'
    };

    this.AWS_S3_DB_BUCKET = {
        key: 'AKIAXOQKE5WDLDX5VEIJ',
        secret: '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',
        name: 'powerludodb-backup',
        region: 'eu-west-2'
    };

    // this.ONESIGNAL_APP_ID = 'db7ae8af-bd10-46dd-9ce9-113d429c1d7e';
    this.ONESIGNAL_APP_ID = 'e147485f-6d23-4800-bc3a-84f371606b43';
    
    //For OTP SMS
    //Local
    // this.twilioAccountKey = {
    //     accountSid: 'AC881dacfdcd763ddb3dbb3847dc2cbfe0',
    //     authToken:'d068c4bd87ba0bed20d31bcc4d0f118d',    
    //     sender: '+12565783385'
    // };

    this.twilioAccountKey = {
        accountSid: 'AC87725dff4b693fab489986a486859014',
        authToken:'dea7ef16a18caefca1a489ea7c5ecbd9',    
        sender: '+1 205 619 6712'
    };

    //For OTP SMS
    this.textLocalKey = {
        apikey: 'xxxx',
        sender: 'xxxx'
    };


    //For OTP SMS
    // this.textLocalKey = {
    //     apikey: 'NUA10t/MT2k-XxzBkGeW9TazB5YxvC3WzRvROF12SG',
    //     sender: 'LudoCL'
    // };

    this.default_user_pic = 'https://power-ludo.s3.eu-west-2.amazonaws.com/files/1581318195188lgw81qgu40.png';
    this.logo_img = 'https://www.ludocircle.com/img/Logo_for-website.png';
    this.otp_length = 6;
    this.otp_continuous_false_limit = 3;
    this.otp_send_limit = 10;
    this.live_url = process.env.ADMIN_BASE;

    this.secret_session_data =
        'z86BCwN4ORqj24rRmVm7GzGqogj8A33UVNUfPU43i6Q8vPoWNvw8QMSHqnzxwBZ0W1ZbWI7Qx4MqRvwQOkGqmzEsv5BmiDgoulROFB1T5Vk51UhV9U55tnLBMnpbMy9ozPUCROgL4r3NwcIMWRe3hT1KKKDKUOtRPefOiUxn3btx6D1vtgn9tFwgwbiGR4y3GRDal6U5';

    this.referral_earn_max_limit = 500;
    this.referral_amount_per_match = 1;

    //For PAYTM API
    // STAGING
    
    this.PAYTM_STAGING = {
        URL: 'https://securegw-stage.paytm.in',
        MID: 'eoXXjS65703614358059',
        MERCHANT_KEY: '2Pdhm&B9MR!cG&g!',
        WEBSITE: 'WEBSTAGING',
        CHANNEL_ID: 'WEB',
        INDUSTRY_TYPE_ID: 'Retail'
    };

    // PRODUCTION
    this.PAYTM_PROD = {
        URL: 'https://securegw.paytm.in',
        MID: 'xxxxx',
        MERCHANT_KEY: 'xxxxxx',
        WEBSITE: 'DEFAULT',
        CHANNEL_ID: 'WEB',
        INDUSTRY_TYPE_ID: 'Retail'
    };


    //For PAYTM API
    // STAGING
    // this.PAYTM_STAGING = {
    //     URL: 'https://securegw-stage.paytm.in',
    //     MID: 'rXDhxx73581761932320',
    //     MERCHANT_KEY: 'i3RXmj5aw0s4BE2!',
    //     WEBSITE: 'WEBSTAGING',
    //     CHANNEL_ID: 'WEB',
    //     INDUSTRY_TYPE_ID: 'Retail'
    // };
    // // PRODUCTION
    // this.PAYTM_PROD = {
    //     URL: 'https://securegw.paytm.in',
    //     MID: 'LudoCi81579133693045',
    //     MERCHANT_KEY: 'EJ5VIwYx%neyuDnd',
    //     WEBSITE: 'DEFAULT',
    //     CHANNEL_ID: 'WEB',
    //     INDUSTRY_TYPE_ID: 'Retail'
    // };

    this.PAYTM = {
        URL: process.env.PAYMENT_MODE == 'LIVE' ? this.PAYTM_PROD.URL : this.PAYTM_STAGING.URL,
        MID: process.env.PAYMENT_MODE == 'LIVE' ? this.PAYTM_PROD.MID : this.PAYTM_STAGING.MID,
        MERCHANT_KEY:
            process.env.PAYMENT_MODE == 'LIVE' ? this.PAYTM_PROD.MERCHANT_KEY : this.PAYTM_STAGING.MERCHANT_KEY,
        WEBSITE: process.env.PAYMENT_MODE == 'LIVE' ? this.PAYTM_PROD.WEBSITE : this.PAYTM_STAGING.WEBSITE,
        CHANNEL_ID: process.env.PAYMENT_MODE == 'LIVE' ? this.PAYTM_PROD.CHANNEL_ID : this.PAYTM_STAGING.CHANNEL_ID,
        INDUSTRY_TYPE_ID:
            process.env.PAYMENT_MODE == 'LIVE' ? this.PAYTM_PROD.INDUSTRY_TYPE_ID : this.PAYTM_STAGING.INDUSTRY_TYPE_ID,
        PROCESS_TRANSACTION: '/order/process',
        CHECK_TRANSACTION_STATUS: '/order/status'
    };

    this.MOVE_PATH = [
        [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            38,
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            46,
            47,
            48,
            49,
            50,
            51,
            52,
            53,
            54,
            55,
            56,
            57
        ],
        [
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            38,
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            46,
            47,
            48,
            49,
            50,
            51,
            58,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            59,
            60,
            61,
            62,
            63,
            64
        ],
        [
            27,
            28,
            29,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            38,
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            46,
            47,
            48,
            49,
            50,
            51,
            58,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            65,
            66,
            67,
            68,
            69,
            70
        ],
        [
            40,
            41,
            42,
            43,
            44,
            45,
            46,
            47,
            48,
            49,
            50,
            51,
            58,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            38,
            71,
            72,
            73,
            74,
            75,
            76
        ]
    ];

    this.safeZone = [1, 9, 14, 22, 27, 35, 40, 48];

    this.defaultPosition = [-1, -1, -1, -1];

    this.roomFees = [20, 50, 100, 150, 200, 300, 500, 1000];
    // 20, 50, 100, 150, 200, 300, 500, 1000

    this.roomFeesPrivate = [50, 100, 150, 200, 300, 500, 1000];
    // 20, 50, 100, 150, 200, 300, 500, 1000

    this.noOfPlayersInPublic = [2,4];
    // 2, 3, 4

    this.noOfPlayersInPrivate = [2,4];
    // 2, 3, 4

    this.WinPriceDistribution = {
        2: {
            20: {
                per_game: 40,
                winners: [36, -20, -20, -20],
                commission: 6
            },
            50: {
                per_game: 100,
                winners: [90, -50, -50, -50],
                commission: 10
            },
            100: {
                per_game: 200,
                winners: [180, -100, -100, -100],
                commission: 20
            },
            150: {
                per_game: 300,
                winners: [270, -150, -150, -150],
                commission: 30
            },
            200: {
                per_game: 400,
                winners: [360, -200, -200, -200],
                commission: 40
            },
            300: {
                per_game: 600,
                winners: [540, -300, -300, -300],
                commission: 60
            },
            500: {
                per_game: 1000,
                winners: [900, -500, -500, -500],
                commission: 100
            },
            1000: {
                per_game: 2000,
                winners: [1800, -1000, -1000, -1000],
                commission: 200
            }
        },
        3: {
            20: {
                per_game: 60,
                winners: [52, -20, -20, -20],
                commission: 8
            },
            50: {
                per_game: 150,
                winners: [130, -50, -50, -50],
                commission: 20
            },
            100: {
                per_game: 300,
                winners: [260, -100, -100, -100],
                commission: 40
            },
            150: {
                per_game: 450,
                winners: [390, -150, -150, -150],
                commission: 60
            },
            200: {
                per_game: 600,
                winners: [520, -200, -200, -200],
                commission: 80
            },
            300: {
                per_game: 900,
                winners: [780, -300, -300, -300],
                commission: 120
            },
            500: {
                per_game: 1500,
                winners: [1300, -500, -500, -500],
                commission: 200
            },
            1000: {
                per_game: 3000,
                winners: [2600, -1000, -1000, -1000],
                commission: 400
            }
        },
        4: {
            20: {
                per_game: 80,
                winners: [68, -20, -20, -20],
                commission: 12
            },
            50: {
                per_game: 200,
                winners: [170, -50, -50, -50],
                commission: 30
            },
            100: {
                per_game: 400,
                winners: [340, -100, -100, -100],
                commission: 60
            },
            150: {
                per_game: 600,
                winners: [510, -150, -150, -150],
                commission: 90
            },
            200: {
                per_game: 800,
                winners: [680, -200, -200, -200],
                commission: 120
            },
            300: {
                per_game: 1200,
                winners: [1020, -300, -300, -300],
                commission: 180
            },
            500: {
                per_game: 2000,
                winners: [1700, -500, -500, -500],
                commission: 300
            },
            1000: {
                per_game: 4000,
                winners: [3400, -1000, -1000, -1000],
                commission: 600
            }
        }
    };

    this.STATES_LIST = [
        {
            "name":"gujarat",
        },
        {
            "name":"Maharashtra",
        },
        {
            "name":"Tamil Nadu",
        },
        {
            "name":"Assam",
        },
    ]

    this.ref_bonus = 5;
    this.signup_bonus = 10;

    this.paytm_min_withdraw_limit = 50;
    this.bank_min_withdraw_limit = 50;

    this.wheel_type = {
        FREE: 0,
        PAID: 1,
    };
    this.wheelData = [1,500,3,100,10,5,10000,50,100000,1000];
    
};

module.exports = new config();
