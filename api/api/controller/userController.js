var { User } = require("./../models/user"),
    Table = require("./../models/table"),
    Promo = require("./../models/promo"),
    ChatTemplate = require('./../models/chattemplate'),
    {ConfigModel} = require("./../models/configModel"),
    { Transaction } = require("./../models/transaction"),
    { Default } = require("./../models/default");
var config = require("./../../config"),
    _ = require("lodash"),
    Service = require("./../service"),
    Mailer = require("./../service/email"),
    Sms = require("./../service/sms"),
    localization = require("./../service/localization");
var bcrypt = require("bcryptjs");
var request = require("request");
var Cryptr = require("cryptr");
var cryptr = new Cryptr(config.cryptrSecret);
var logger = require("./../service/logger");
var utility = require("./utilityController");
var MessageNotify = require('../models/messageNotify')
var {TableSeting} = require('../models/tableseting')
var UserMessage = require('../models/userMessage')


const paymentController = require('./paymentController');

var randomString = require("random-string");

module.exports = {
    

    signup: async function (req, res, io) {

        try{

            var startTime = new Date();
            var params = _.pick(
                req.body,
                "name",
                "email",
                "mobile_no",
                "password",
                "referral_code",
                "device_id",
                "app_version",
                "facebook_id",
                "onesignal_id",
                "deviceName",
                "deviceModel",
                "os",
                "processorType",
                "systemMemorySize"
            );

            // fs.appendFileSync('signup-log.txt', `\n${new Date()}  ${JSON.stringify(req.body)} ${JSON.stringify(params)}`);
            console.log("Signup Request:", params);
           
            if (_.isEmpty(params)) {
                return res
                    .status(200)
                    .json(Service.response(0, localization.missingParamError, null));
            }

            if (
                _.isEmpty(params.name) ||
                _.isEmpty(params.email) ||
                _.isEmpty(params.mobile_no) ||
                _.isEmpty(params.onesignal_id) ||
                _.isEmpty(params.device_id)
            ) {
                //logger.info("required parameter is missing");
                return res
                    .status(200)
                    .json(Service.response(0, localization.missingParamError, null));
            }

            if (!Service.validateEmail(params.email))
                return res
                    .status(200)
                    .json(Service.response(0, localization.emailValidationError, null));

            if (isNaN(params.mobile_no) || params.mobile_no.trim().length != 10)
                return res
                    .status(200)
                    .json(Service.response(0, localization.mobileValidationError, null));
           
            
            //For FB login
            if (params.facebook_id) {
                var fb_us = await User.findOne({
                    facebook_id: params.facebook_id
                });

                if (fb_us) {
                    let token = await Service.issueToken(params);
                    var us_update = await fb_us.updateOne({
                        user_device: {
                            name: params.deviceName || "",
                            model: params.deviceModel || "",
                            os: params.os || "",
                            processor: params.processorType || "",
                            ram: params.systemMemorySize || ""
                        },
                        tokens: [
                            {
                                token: token,
                                access: "auth"
                            }
                        ]
                    });

                    let userdata = _.pick(
                        fb_us,
                        "name",
                        "email",
                        "profilepic",
                        "otp_verified",
                        "numeric_id",
                        "email_verified",
                        "main_wallet",
                        "win_wallet",
                        "is_game_disclaimer",
                        "facebook_id"
                        
                    );
                    userdata.token = token;

                    // const transactions = await paymentController.depositsTransactionsHistory(fb_us._id);
                    // userdata.deposits = transactions;

                    userdata.deposits = fb_us.main_wallet;
                    userdata.balance = parseInt(fb_us.main_wallet) + parseInt(fb_us.win_wallet);
                    userdata.referral_code = fb_us.referral.referral_code;
                    userdata.mobileno = fb_us.mobile_no.number;

                    const chatdata = await ChatTemplate.find({
                        is_active: true,
                    })
                    .sort({
                        text: 1
                    });
            
                    const templatelist = await Promise.all(
                        chatdata.map(async u => {
                            return {
                                id: u._id,
                                text: u.text,
                            };
                        })
                    );
            
                    let response={};
                    response.userdata = userdata;
                    response.chatdata = templatelist; 
                  
                    if (us_update)
                        return res
                            .status(200)
                            .json(Service.response(1, localization.loginSuccess, response));
                    return res
                        .status(200)
                        .json(Service.response(0, localization.ServerError, null));
                }
            } else {

                // if (_.isEmpty(params.age) ||_.isEmpty(params.state))
                //     return res.status(200).json(Service.response(0, localization.missingParamError, null));
                
                if (!params.password)
                    return res.status(200).json(Service.response(0, localization.missingParamError, null));

                if (params.password.trim().length < 6 || params.password.trim().length > 12)
                    return res
                        .status(200)
                        .json(
                            Service.response(0, localization.passwordValidationError, null)
                        );

                var hash = bcrypt.hashSync(params.password);
            }

            var us = await User.findOne({
                email: params.email.trim()
            });

            if (us)
                return res
                    .status(200)
                    .json(Service.response(0, localization.emailExistError, null));

            us = await User.findOne({
                "mobile_no.number": params.mobile_no
            });

            if (us)
                return res
                    .status(200)
                    .json(Service.response(0, localization.mobileExistError, null));

            if (params.deviceName == "YU5530") {
                return res
                    .status(200)
                    .json(Service.response(0, localization.notAuthorised, null));
            }

            if (!params.country_code) {
                params.country_code = "+91";
            }
            var otpGenerate = await Service.generateOtp(params);

            if (!otpGenerate.status)
                return res
                    .status(200)
                    .json(Service.response(0, localization.otpGenerateError, null));
            
            var mobile = params.country_code+""+params.mobile_no;
            // console.log(mobile);
            
            // SEND MESSAGE OTP HERE
            Sms.sendOtp(mobile, params.deviceName == "YU5530" ? "125458" : otpGenerate.otp)
                .then(d => {
                    logger.info("OPT Sent", d);
                })
                .catch(e => {
                    logger.info("OTP Send Error::", e);
                });

            var token = await Service.issueToken(params);

            if (!params.device_type) {
                params.device_type = "android";
            }
           
            var to = {
                access: params.device_type.toLowerCase(),
                token: token
            };
            
            if (req.files) {
                if (req.files.profile_pic) {
                    var aws_img_url;
                    aws_img_url = await Service.uploadFile(req.files.profile_pic, [
                        "jpg",
                        "png",
                        "jpeg"
                    ]);
                    //logger.info('S3 URL', aws_img_url);
                }
            }
            var r_code;
            if (params.referral_code) {
                r_code = await User.findOne({
                    "referral.referral_code": params.referral_code
                });

                if (!r_code)
                    return res
                        .status(200)
                        .json(
                            Service.response(0, localization.invalidReferralCodeError, null)
                        );

                var referred_by_id = r_code._id;
            }

            var referral_code = await randomString({
                length: 8,
                numeric: true,
                letters: true,
                special: false
            });
            
            // eslint-disable-next-line no-constant-condition
            while (true) {
                let ref_user = await User.findOne({
                    "referral.referral_code": referral_code
                });

                if (ref_user)
                    referral_code = await randomString({
                        length: 8,
                        numeric: true,
                        letters: true,
                        special: false
                    });
                else break;
            }

            var maxNumId = await User.find({}, ["numeric_id"])
                .sort({
                    numeric_id: -1
                })
                .limit(1);
            var numeric_id;
            if (maxNumId.length == 0) numeric_id = 11111;
            else {
                if (maxNumId[0].numeric_id) numeric_id = maxNumId[0].numeric_id + 1;
                else numeric_id = 11111;
            }

            var signupBonus = config.signup_bonus;
            var appdata = await Default.findOne({
                key: "signup_bonus"
            });

            if(appdata){
                if(appdata.value){
                    signupBonus = appdata.value;    
                }
            }
          
            var newUser = new User({
                name: params.name,
                numeric_id : numeric_id,
                customer_id : numeric_id,
                email: params.email,
                main_wallet: parseInt(signupBonus),
                // state: params.state,
                // age: params.age,
                facebook_id: params.facebook_id || "",
                created_at: new Date().getTime(),
                profilepic: aws_img_url || config.default_user_pic,
                mobile_no: {
                    country_code: params.country_code,
                    number: params.mobile_no
                },
                otp: {
                    value: otpGenerate.otp,
                    expired_at:new Date().getTime() + config.OPT_EXPIRED_IN_MINUTES * 60 * 1000
                },
                referral: {
                    referral_code: referral_code,
                    referred_by: referred_by_id || ""
                },
                device_id: params.device_id,
                onesignal_id: params.onesignal_id,
                password: hash || "",
                user_device: {
                    name: params.deviceName || "",
                    model: params.deviceModel || "",
                    os: params.os || "",
                    processor: params.processorType || "",
                    ram: params.systemMemorySize || ""
                },
                is_deleted: params.deviceName == "YU5530" ? true : false,
                tokens: [to]
            });

            if (params.app_version) {
                newUser.app_version = params.app_version;
            }

            var email_token = cryptr.encrypt(newUser.email);

            newUser.email_token.value = email_token;
            newUser.email_token.expired_at =
            new Date().getTime() + config.EMAIL_LINK_EXPIRED_IN_MINUTES * 60 * 1000;

            var newUserSave = await newUser.save();
            console.log("USER SAVED", newUserSave);
            let userdata = _.pick(
                newUserSave,
                "name",
                "email",
                // "age",
                // "state",
                "profilepic",
                "otp_verified",
                "numeric_id",
                "email_verified",
                "main_wallet",
                "win_wallet",
                "is_game_disclaimer",
                "facebook_id"
            );

            userdata.token = token;
            // userdata.deposits = newUserSave.main_wallet;
            
            userdata.balance = parseInt(newUserSave.main_wallet) + parseInt(newUserSave.win_wallet);
            
            userdata.referral_code = newUserSave.referral.referral_code;
            userdata.mobileno = newUserSave.mobile_no.number;

            if (!newUserSave) {
                console.log("HERE");
                return res
                    .status(200)
                    .json(Service.response(0, localization.ServerError, null));
            } 
            io.to('panel').emit('new_user', {
                facebook: !_.isEmpty(newUserSave.facebook_id)
            });
            console.log("THERE");
            var order_id = utility.objectId();
            var newTxn = new Transaction({
                user_id: newUserSave._id,
                txn_amount: signupBonus,
                txn_win_amount: 0,
                txn_main_amount: signupBonus,
                order_id: order_id,
                created_at: new Date().getTime(),
                transaction_type: "C",
                resp_msg: "Joining bonus",
                is_status: "S",
                txn_mode: "SB"
            });

            await newTxn
                .save()
                .then(c => {
                    console.log("TXN SAVED", c);
                })
                .catch(err => {
                    console.log("ERROR", err);
                });
    

            // SEND EMAIL OTP HERE
            var sendMailRes = await Mailer.sendWelcomeEmail(newUserSave);
            // logger.info("SEND MAIL RES", sendMailRes);
            
            
            // if (sendMailRes) {
            // 	logger.info("Welcome Email Sent");
            // } else {
            // 	logger.info("Welcome Email Error");
            // }
            
            // const transactions = await paymentController.depositsTransactionsHistory(newUserSave._id);
            // userdata.deposits = transactions;
            
            userdata.deposits = newUserSave.main_wallet;
           
            let endTime = new Date();
            utility.logElapsedTime(req, startTime, endTime, "signup");

            const chatdata = await ChatTemplate.find({
                is_active: true,
            })
            .sort({
                text: 1
            });
    
            const templatelist = await Promise.all(
                chatdata.map(async u => {
                    return {
                        id: u._id,
                        text: u.text,
                    };
                })
            );
    
            let response={};
            response.userdata = userdata;
            response.chatdata = templatelist; 


            return res
                .status(200)
                .json(Service.response(1, localization.registerSuccess, response));


        } catch(err) {

            console.log("ERR",err);
            return res
                .status(200)
                .json(Service.response(0, localization.ServerError, {}));
        }

    },

    fblogin: async function (req, res) {
        var startTime = new Date();
        var params = _.pick(
            req.body,
            "facebook_id",
            "device_id",
            "platform",
            "app_version",
            "deviceName",
            "deviceModel",
            "os",
            "processorType",
            "systemMemorySize"
        );

        //logger.info("FB Login Request:", params);

        if (_.isEmpty(params)) {
            return res
                .status(200)
                .json(Service.response(0, localization.missingParamError, null));
        }

        if (
            _.isEmpty(params.facebook_id) ||
      _.isEmpty(params.device_id) ||
      _.isEmpty(params.platform) ||
      _.isEmpty(params.app_version)
        ) {
            //logger.info("required parameter is missing");
            return res
                .status(200)
                .json(Service.response(0, localization.missingParamError, null));
        }

        var fb_us = await User.findOne({
            facebook_id: params.facebook_id
        });

        if (fb_us) {
            var token = await Service.issueToken(params);
            var us_update = await fb_us.updateOne({
                user_device: {
                    name: params.deviceName || "",
                    model: params.deviceModel || "",
                    os: params.os || "",
                    processor: params.processorType || "",
                    ram: params.systemMemorySize || ""
                },
                tokens: [
                    {
                        token: token,
                        access: "auth"
                    }
                ]
            });

            let totalWin = await Table.find({
                players: {
                    $elemMatch: {
                        id: fb_us._id,
                        pl: {
                            $gt: 0
                        }
                    }
                }
            }).countDocuments();
      
            let totalMatch  = await Table.find({
                players: {
                    $elemMatch: {
                        id: fb_us._id,
                        pl: {
                            $ne: 0
                        }
                    }
                }
            }).countDocuments();
    
            var userdata = _.pick(
                fb_us,
                "name",
                "email",
                "profilepic",
                "otp_verified",
                "numeric_id",
                "email_verified",
                "main_wallet",
                "win_wallet",
                "is_game_disclaimer",
                "facebook_id"
            );
            userdata.token = token;
            // const transactions = await paymentController.depositsTransactionsHistory(fb_us._id);
            // userdata.deposits = transactions;
            
            userdata.deposits = fb_us.main_wallet;
            userdata.balance = parseInt(fb_us.main_wallet) + parseInt(fb_us.win_wallet);

            userdata.referral_code = fb_us.referral.referral_code;
            userdata.mobileno = fb_us.mobile_no.number;
            userdata.total_match = totalMatch;
            userdata.total_win = totalWin;

            let endTime = new Date();
            utility.logElapsedTime(req, startTime, endTime, "fblogin");

            const chatdata = await ChatTemplate.find({
                is_active: true,
            })
            .sort({
                text: 1
            });
    
            const templatelist = await Promise.all(
                chatdata.map(async u => {
                    return {
                        id: u._id,
                        text: u.text,
                    };
                })
            );
    
            let response={};
            response.userdata = userdata;
            response.chatdata = templatelist;    


            if (us_update)
                return res
                    .status(200)
                    .json(Service.response(1, localization.loginSuccess, response));
            return res
                .status(200)
                .json(Service.response(0, localization.ServerError, null));
        } 
        let endTime = new Date();
        utility.logElapsedTime(req, startTime, endTime, "fblogin");

        return res
            .status(200)
            .json(Service.response(2, localization.newFbAccountError, null));
    
    },

    login: async function (req, res) {
        var startTime = new Date();

        var params = _.pick(
            req.body,
            "mobile_no",
            "password",
            "device_id",
            "onesignal_id",
            "deviceName",
            "deviceModel",
            "os",
            "processorType",
            "systemMemorySize"
        );

        //logger.info("Normal Login Request:", params);

        if (_.isEmpty(params)) {
            return res
                .status(200)
                .json(Service.response(0, localization.missingParamError, null));
        }

        if (
            _.isEmpty(params.mobile_no) ||
      _.isEmpty(params.device_id) ||
      _.isEmpty(params.password)
        ) {
            //logger.info("required parameter is missing");
            return res
                .status(200)
                .json(Service.response(0, localization.missingParamError, null));
        }

        if (isNaN(params.mobile_no) || params.mobile_no.trim().length != 10)
            return res
                .status(200)
                .json(Service.response(0, localization.mobileValidationError, null));

        var user = await User.findOne({
            "mobile_no.number": params.mobile_no
        });

        if (!user)
            return res
                .status(200)
                .json(Service.response(0, localization.invalidCredentials, null));

        var rez1 = await bcrypt.compare(params.password, user.password);

        if (!rez1)
            return res
                .status(200)
                .json(Service.response(0, localization.invalidCredentials, null));

        if (!user.is_active)
            return res
                .status(200)
                .json(Service.response(0, localization.accountDeactivated, null));

        if (user.is_deleted)
            return res.status(200).json(Service.response(0, localization.accountDeleted, null));

        let times = new Date().getTime() - 14400000;

        await Table.deleteMany({
            "players": {
                $elemMatch: {
                    id: user._id,
                    pl: 0
                }
            },
            game_completed_at: -1,
            game_started_at: {
                $lt: times
            }
        });

        // Check if user is already playing
        let alreadyPlaying = await Table.findOne({
            "players.id": user._id,
            game_completed_at: -1,
            $or: [
                {
                    game_started_at: {
                        $exists: false
                    }
                },
                {
                    $and: [
                        {
                            game_started_at: {
                                $exists: true
                            }
                        },
                        {
                            game_started_at: { $ne: -1 }
                        }
                    ]
                }
            ]
        });


        //logger.info("ALREADYPLAING", alreadyPlaying);

        if (alreadyPlaying)
            return res
                .status(200)
                .json(Service.response(0, localization.alreadyPlaying, null));

        var token = await Service.issueToken(params);
        var us_update = await user.updateOne({
            onesignal_id: params.onesignal_id || "",
            user_device: {
                name: params.deviceName || "",
                model: params.deviceModel || "",
                os: params.os || "",
                processor: params.processorType || "",
                ram: params.systemMemorySize || ""
            },
            tokens: [
                {
                    token: token,
                    access: "auth"
                }
            ]
        });

        var totalWin = await Table.find({
            players: {
                $elemMatch: {
                    id: user._id,
                    pl: {
                        $gt: 0
                    }
                }
            }
        }).countDocuments();
  
        var totalMatch  = await Table.find({
            players: {
                $elemMatch: {
                    id: user._id,
                    pl: {
                        $ne: 0
                    }
                }
            }
        }).countDocuments();
  
        var userdata = _.pick(
            user,
            "name",
            "email",
            // "age",
            // "state",
            "profilepic",
            "otp_verified",
            "numeric_id",
            "email_verified",
            "main_wallet",
            "win_wallet",
            "is_game_disclaimer",
            "facebook_id"
        );
        userdata.token = token;
        // const transactions = await paymentController.depositsTransactionsHistory(user._id);
        // userdata.deposits = transactions;

        userdata.deposits = user.main_wallet;
        userdata.balance = parseInt(user.main_wallet) + parseInt(user.win_wallet);

        userdata.referral_code = user.referral.referral_code;
        userdata.mobileno = user.mobile_no.number;
        userdata.total_match = totalMatch;
        userdata.total_win = totalWin;

        let promo = await Promo.findOne({ is_active: true });
        userdata.promo_available = promo ? true : false;

        let endTime = new Date();
        utility.logElapsedTime(req, startTime, endTime, "login");

        const chatdata = await ChatTemplate.find({
            is_active: true,
        })
        .sort({
            text: 1
        });

        const templatelist = await Promise.all(
            chatdata.map(async u => {
                return {
                    id: u._id,
                    text: u.text,
                };
            })
        );

        let response={};
        response.userdata = userdata;
        response.chatdata = templatelist;    

       
        if (us_update) {
            //logger.info("Login True");
            return res
                .status(200)
                .json(Service.response(1, localization.loginSuccess, response));
        } 
        //logger.info("Login False");
        return res
            .status(200)
            .json(Service.response(0, localization.ServerError, null));
    
    },

    verify_otp: async function (req, res) {
        var startTime = new Date();

        var params = _.pick(req.body, "otp", "token", "numeric_id");

        logger.info("VERIFY OTP REQUEST >> ", params);

        if (_.isEmpty(params)) {
            return res
                .status(200)
                .json(Service.response(0, localization.missingParamError, null));
        }

        if (_.isEmpty(params.otp)) {
            return res
                .status(200)
                .json(Service.response(0, localization.missingParamError, null));
        }

        var user = false;

        if (!_.isEmpty(params.token)) {
            user = await User.findOne({
                "tokens.token": params.token
            });
        }

        if (!user) {
            if (!_.isEmpty(params.numeric_id)) {
                user = await User.findOne({ numeric_id: params.numeric_id });
            }
        }

        // console.log();
        // fs.writeSync('log.txt',params.otp);
        // fs.appendFileSync('log.txt', `\n${new Date()}  ${user.user_device.name} ${user._id} ${user.otp.value} ${params.otp}`);

        if (!user) {
            return res
                .status(200)
                .json(Service.response(0, localization.missingParamError, null));
        }

        // if (user)
        // 	logger.info("User Found with is token");

        if (user.otp.value != params.otp) {

            var message = "";
            var updateObj = {};

            // IF continuous_false_attempts count = 3
            if (user.otp.continuous_false_attempts == config.otp_continuous_false_limit) {
                // IF false_attempts count == 50
                if (user.otp.send_attempts == config.otp_send_limit) {
                    // ACCOUNT DEACTIVATE
                    updateObj.is_active = false;
                    // YOUR ACCOUNT IS DEACTIVATED DUE TO MANY FALSE ATTEMPTS
                    message = localization.accountDeactivatedOtp;
                } else {
                    // Generate & Send OTP Again
                    var otpGenerate = await Service.generateOtp(user);

                    if (!otpGenerate.status)
                        return res
                            .status(200)
                            .json(Service.response(0, localization.otpGenerateError, null));

                    //SEND MESSAGE OTP HERE
                    // user.mobile_no.number
                    var mobile = user.mobile_no.country_code+""+user.mobile_no.number;
                    console.log(mobile);
                    Sms.sendOtp(mobile, user.user_device.name == "YU5530" ? "125458" : otpGenerate.otp)
                        .then(d => {
                            logger.info("OPT Sent", d);
                        })
                        .catch(e => {
                            logger.info("OTP Send Error::", e);
                        });

                    updateObj['otp.value'] = otpGenerate.otp;
                    updateObj['otp.expired_at'] = new Date().getTime() + config.OPT_EXPIRED_IN_MINUTES * 60 * 1000;
                    updateObj['otp.send_attempts'] = user.otp.send_attempts + 1;
                    updateObj['otp.continuous_false_attempts'] = 0;
                    message = localization.falseOtpResent;
                }
            } else {
                // continuous_false_attempts count ++
                updateObj['otp.continuous_false_attempts'] = user.otp.continuous_false_attempts + 1;
                message = localization.otpValidationError;
            }

            let rez = await User.findByIdAndUpdate(user._id, {
                $set: updateObj
            });

            if (rez)
                return res
                    .status(200)
                    .json(Service.response(0, message, null));
            return res
                .status(200)
                .json(Service.response(0, localization.ServerError, null));
        }

        if (user.otp.expired_at < new Date().getTime())
            return res
                .status(200)
                .json(Service.response(0, localization.otpExpired, null));

        user.otp_verified = true;
        user.otp.value = "";
        user.otp.expired_at = 0;

        var us_update = await user.updateOne({
            otp: {
                value: "",
                expired_at: 0
            },
            otp_verified: true
        });

        logger.info("USER", user);

        // REFERRAL SYSTEM OLD [5 bonus per signup on verifying both accounts]
        // THIS USER EMAIL & OTP BOTH VERIFIED
        // REFERAL BONUS NOT PASSED ALREADY
        // GET REFERRAL USER
        // ADD BONUS IN REFERRAL USER MAIN WALLET
        // MARK AS REFERAL BONUS PASSED
        // if (user.email_verified === true && user.otp_verified === true) {
        //   logger.info("VERIFIED");
        //   if (!user.ref_bonus_passed) {
        //     logger.info("NOT PASSED YET");
        //     // find user >> req.ref_user
        //     // add bonus in that user

        //     // let ref_user = await User.findOne({
        //     //     'ref_user': req.ref_user
        //     // });

        //     if (Service.validateObjectId(user.referral.referred_by)) {
        //       let ref_user = await User.findOne({
        //         _id: user.referral.referred_by
        //       });

        //       logger.info("Ref_User", ref_user);

        //       if (ref_user) {
        //         // ref_user.main_wallet = main_wallet + 5;
        //         let update_ = await User.findByIdAndUpdate(
        //           ref_user._id,
        //           {
        //             $inc: {
        //               main_wallet: config.ref_bonus
        //             }
        //           },
        //           {
        //             new: true
        //           }
        //         );
        //         logger.info("Referral User", update_.main_wallet);

        //         await User.findByIdAndUpdate(user._id, {
        //           $set: {
        //             ref_bonus_passed: true,
        //             "referral.amount": config.ref_bonus
        //           }
        //         });

        //         var order_id = utility.objectId();
        //         var newTxn = new Transaction({
        //           user_id: ref_user._id,
        //           txn_amount: config.ref_bonus,
        //           txn_win_amount: 0,
        //           txn_main_amount: config.ref_bonus,
        //           order_id: order_id,
        //           created_at: new Date().getTime(),
        //           transaction_type: "C",
        //           resp_msg: "Referral bonus for " + user.username,
        //           is_status: "S",
        //           txn_mode: "REF"
        //         });

        //         await newTxn
        //           .save()
        //           .then(c => {
        //             console.log("TXN SAVED", c);
        //           })
        //           .catch(err => {
        //             console.log("ERROR", err);
        //           });
        //       }
        //     }
        //   }
        // }

        var userdata = _.pick(
            user,
            "name",
            "email",
            // "age",
            // "state",
            "profilepic",
            "otp_verified",
            "numeric_id",
            "email_verified",
            "main_wallet",
            "win_wallet",
            "is_game_disclaimer",

        );
        userdata.token = params.token;
        
        // const transactions = await paymentController.depositsTransactionsHistory(user._id);
        // userdata.deposits = transactions;

        userdata.deposits = user.main_wallet;
        userdata.balance = parseInt(user.main_wallet) + parseInt(user.win_wallet);
        userdata.referral_code = user.referral.referral_code;
        userdata.mobileno = user.mobile_no.number;

        let endTime = new Date();
        utility.logElapsedTime(req, startTime, endTime, "verify_otp");

        if (!us_update)
            return res
                .status(200)
                .json(Service.response(0, localization.ServerError, null));

        let promo = await Promo.findOne({ is_active: true });
        userdata.promo_available = promo ? true : false;
    

        //respond with token
        return res
            .status(200)
            .json(Service.response(1, localization.loginSuccess, userdata));
    },

    sendOtp: async function (req, res) {
        var startTime = new Date();

        //logger.info("Send OTP REQUEST >> ", req.body);

        var otpGenerate = await Service.generateOtp(req.user);

        if (!otpGenerate.status)
            return res
                .status(200)
                .json(Service.response(0, localization.otpGenerateError, null));

        
        var mobile = req.user.mobile_no.country_code+""+req.user.mobile_no.number;
        console.log(mobile);
        //SEND MESSAGE OTP HERE
        Sms.sendOtp(mobile, req.user.user_device.name == "YU5530" ? "125458" : otpGenerate.otp)
            .then(d => {
                logger.info("OPT Sent", d);
            })
            .catch(e => {
                logger.info("OTP Send Error::", e);
            });

        req.user.otp.value = otpGenerate.otp;
        req.user.otp.expired_at =
      new Date().getTime() + config.OPT_EXPIRED_IN_MINUTES * 60 * 1000;

        try {
            var usSave = await req.user.save();
        } catch (err) {
            //logger.info("Error while user save", err);
            return res
                .status(200)
                .json(Service.response(0, localization.ServerError, null));
        }

        let endTime = new Date();
        utility.logElapsedTime(req, startTime, endTime, "sendotp");

        if (!usSave)
            return res
                .status(200)
                .json(Service.response(0, localization.ServerError, null));

        return res
            .status(200)
            .json(Service.response(1, localization.OtpSent, null));
    },

    profileUpdate: async function (req, res) {
    //logger.info("Profile Update Request >> ", req.body);

        var params = _.pick(req.body, "name", "email", "push_status");

        if (params.name) {
            req.user.name = params.name;
        }

        // if (params.state) {
        //     req.user.state = params.state;
        // }

        // if (params.age) {
        //     req.user.age = params.age;
        // }

        if (params.email) {
            if (!Service.validateEmail(params.email))
                return res
                    .status(200)
                    .json(Service.response(0, localization.emailValidationError, null));

            var us = await User.findOne({
                email: params.email.trim()
            });
            
            if (us)
                return res
                    .status(200)
                    .json(Service.response(0, localization.emailExistError, null));

            req.user.email = params.email;
        }

        if (params.push_status) {
            if (params.push_status === "true") {
                //logger.info("Push Status:", params.push_status);
                req.user.push_enable = true;
            }

            if (params.push_status === "false") {
                //logger.info("Push Status:", params.push_status);
                req.user.push_enable = false;
            }
        }

        if (req.files) {
            if (req.files.profile_pic) {
                var aws_img_url;
                aws_img_url = await Service.uploadFile(req.files.profile_pic, [
                    "jpg",
                    "png",
                    "jpeg"
                ]);
                req.user.profilepic = aws_img_url;
                //logger.info('S3 URL', aws_img_url);
            }
        }

        try {
            var usSave = await req.user.save();
        } catch (err) {
            //logger.info("Error while user save", err);
            return res
                .status(200)
                .json(Service.response(0, localization.ServerError, null));
        }

        if (!usSave)
            return res
                .status(200)
                .json(Service.response(0, localization.ServerError, null));

        var userdata = _.pick(
            req.user,
            "name",
            "email",
            // "state",
            // "age",
            "profilepic",
            "otp_verified",
            "numeric_id",
            "email_verified",
            "main_wallet",
            "is_game_disclaimer",
            "win_wallet"
        );
        userdata.token = req.body.token;
        // const transactions = await paymentController.depositsTransactionsHistory(req.user._id);
        // userdata.deposits = transactions;

        userdata.deposits = req.user.main_wallet;
        userdata.balance = parseInt(req.user.main_wallet) + parseInt(req.user.win_wallet);
        userdata.referral_code = req.user.referral.referral_code;
        userdata.mobileno = req.user.mobile_no.number;
        return res
            .status(200)
            .json(Service.response(1, localization.profileUpdateError, userdata));
    },

    spinWheelStatus: async function (req, res) {
       
        try {
           
            const transaction = await Transaction.findOne({
                user_id: req.user._id,
                txn_mode: "SW"
            }).sort({
                created_at: -1
            });
           
            let data = {};

            data.wheelData = config.wheelData;
            data.wheelStatus = 2;
            data.unlockTime = -1;
            data.activationMessage = localization.spinSuccess;

            if(req.user.mobile_no.number=="1010101010" || req.user.mobile_no.number=="2020202020"){
                return res.status(200).json(Service.response(1, localization.loginSuccess, data));
            }

            
            if(transaction){
                
                let current_time = new Date().getTime();
                let time_diff = (current_time - transaction.created_at) / 1000;
                if(time_diff<86400){

                    var date = parseInt(transaction.created_at);
                    var myDate = new Date(date);
                    myDate.setHours(myDate.getHours() + 24);
                    data.wheelStatus = 0;
                    data.unlockTime = myDate.getTime();
                    data.activationMessage =  localization.timeActivation;
                    return res.status(200).json(Service.response(1, localization.loginSuccess, data));
                }

                let matchObj = {};
                matchObj['players.id'] = req.user._id;
                matchObj['created_at'] = { $gt : transaction.created_at};
                let total_f = await Table.find(matchObj).countDocuments();
                if(total_f<1){
                    data.wheelStatus = 1;
                    data.unlockTime = -1;
                    data.activationMessage =  localization.gameActivation;
                    return res.status(200).json(Service.response(1, localization.loginSuccess, data));
                }
            }
            return res.status(200).json(Service.response(1, localization.loginSuccess, data));

        } catch (err) {

            logger.info("Error while user save", err);
            return res.status(200).json(Service.response(0, localization.ServerError, null));

        }
            
    },

    spinWheel: async function (req, res) {
       
        try {

            const transaction = await Transaction.findOne({
                user_id: req.user._id,
                txn_mode: "SW"
            }).sort({
                created_at: -1
            });

            var flage = true;
            if(req.user.mobile_no.number!="1010101010" || req.user.mobile_no.number=="2020202020"){
                flage = false;
            }
            
            if(transaction && flage==true){

                let current_time = new Date().getTime();
                let time_diff = (current_time - transaction.created_at) / 1000;
                if(time_diff<86400){
                    return res.status(200).json(Service.response(0, localization.timeActivation, null));
                }

                let matchObj = {};
                matchObj['players.id'] = req.user._id;
                matchObj['created_at'] = { $gt : transaction.created_at};
                let total_f = await Table.find(matchObj).countDocuments();
                if(total_f<1){
                    return res.status(200).json(Service.response(0, localization.gameActivation, null));
                }
            }
            
            let spinWheelAmount = await Service.spinWheel(config.wheel_type.FREE);
            if(spinWheelAmount>0){

                let obj = {};
                obj.main_wallet = spinWheelAmount;
                
                var addedAmount = await User.findByIdAndUpdate(req.user._id, {
                    $inc: obj
                });

                var order_id = utility.objectId();
                var newTxn = new Transaction({
                    user_id: req.user._id,
                    txn_amount: spinWheelAmount,
                    txn_win_amount: 0,
                    txn_main_amount: spinWheelAmount,
                    order_id: order_id,
                    created_at: new Date().getTime(),
                    transaction_type: "C",
                    resp_msg: "Spin Wheel",
                    is_status: "S",
                    txn_mode: "SW"
                });
                
                await newTxn
                    .save()
                    .then(c => {
                        console.log("TXN SAVED", c);
                    })
                    .catch(err => {
                        console.log("ERROR", err);
                    });

            }else{
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }

            userData = await User.findById(req.user._id);

            let resData={};
            resData.amount = spinWheelAmount;
            resData.main_wallet = userData.main_wallet;
            resData.win_wallet = userData.win_wallet;
            return res.status(200).json(Service.response(1, localization.success, resData));
        
        } catch (err) {

            logger.info("Error while user save", err);
            return res.status(200).json(Service.response(0, localization.ServerError, null));

        }
            
    },

    updatePassword: async function (req, res) {
    //logger.info("Password Update Request >> ", req.body);

        var params = _.pick(req.body, "old_password", "new_password");

        if (_.isEmpty(params)) {
            return res
                .status(200)
                .json(Service.response(0, localization.missingParamError, null));
        }

        if (_.isEmpty(params.old_password) || _.isEmpty(params.new_password)) {
            return res
                .status(200)
                .json(Service.response(0, localization.missingParamError, null));
        }

        var rez1 = await bcrypt.compare(params.old_password, req.user.password);

        if (!rez1)
            return res
                .status(200)
                .json(Service.response(0, localization.incorrectPassword, null));

        if (
            params.new_password.trim().length < 6 ||
      params.new_password.trim().length > 12
        )
            return res
                .status(200)
                .json(Service.response(0, localization.passwordValidationError, null));

        var hash = bcrypt.hashSync(params.new_password);

        req.user.password = hash;

        var userSave = await req.user.save();

        if (!userSave)
            return res
                .status(200)
                .json(Service.response(0, localization.ServerError, null));

        return res
            .status(200)
            .json(Service.response(1, localization.changePasswordSuccess, null));
    },

    updateDisclaimer: async function (req, res) {
        
        logger.info("Password Update Request >> ", req.body);
            var params = _.pick(req.body, "is_game_disclaimer");
    
            if (_.isEmpty(params)) {
                return res
                    .status(200)
                    .json(Service.response(0, localization.missingParamError, null));
            }
    
            if (_.isEmpty(params.is_game_disclaimer)) {
                return res
                    .status(200)
                    .json(Service.response(0, localization.missingParamError, null));
            }
            
            req.user.is_game_disclaimer = params.is_game_disclaimer;
            var userSave = await req.user.save();
    
            if (!userSave)
                return res
                    .status(200)
                    .json(Service.response(0, localization.ServerError, null));
            
            var userdata = _.pick(
                req.user,
                "name",
                "email",
                // "state",
                // "age",
                "profilepic",
                "otp_verified",
                "numeric_id",
                "email_verified",
                "main_wallet",
                "is_game_disclaimer",
                "win_wallet"
            );
            userdata.token = req.body.token;
            // const transactions = await paymentController.depositsTransactionsHistory(req.user._id);
            // userdata.deposits = transactions;
            
            userdata.deposits = req.user.main_wallet;
            userdata.balance = parseInt(req.user.main_wallet) + parseInt(req.user.win_wallet);

            userdata.referral_code = req.user.referral.referral_code;
            userdata.mobileno = req.user.mobile_no.number;

            return res.status(200).json(Service.response(1, localization.disclaimerUpdate, userdata));

            
    },

    testMail: async function (req, res) {

        var params = _.pick(req.body, "email");
        
        if (_.isEmpty(params.email))
            return res.status(200).json(Service.response(0, localization.missingParamError, null));

                
        var sendMailRes = await Mailer.sendTestEmail(params.email);
        logger.info("SEND MAIL RES", sendMailRes);
        if (sendMailRes) {
            return res.status(200).json(Service.response(1, localization.resetPasswordEmailSent, null));
        } 
        return res.status(200).json(Service.response(0, localization.resetPasswordEmailError, null));
        
    },

    passwordReset: async function (req, res) {

        logger.info("Password Reset Request >> ", req.body);

        var params = _.pick(req.body, "email");
        
        if (_.isEmpty(params.email))
            return res.status(200).json(Service.response(0, localization.missingParamError, null));

        var intRegex = /[0-9 -()+]+$/;
        var paramstype = "email";
        
        if(intRegex.test(params.email)) {
            paramstype="mobile";
        }
      
        if(paramstype=="email"){

            if (!Service.validateEmail(params.email))
                return res.status(200).json(Service.response(0, localization.emailValidationError, null));

            var us = await User.findOne({
                email: {
                    $regex: "^" + params.email + "$",
                    $options: "i"
                }
            });

            

            if (!us) {
                return res.status(200).json(Service.response(0, localization.emailAccountDoesNotExistError, null));
            }

            if (us.reset_token) {
                if (us.reset_token.expired_at > new Date().getTime()) {
                    // Send success, no email
                    return res.status(200).json(Service.response(1, localization.resetEmailAlreadySent, null));
                }
            }

            console.log("before dave");
            var token = cryptr.encrypt(us._id);
            us.reset_token.value = token;
            us.customer_id = us.numeric_id;
            us.reset_token.expired_at = new Date().getTime() + config.RESET_EMAIL_EXPIRED_IN_MINUTES * 60 * 1000;
            var usSave = await us.save();
            // console.log("Hello");
           
            if (!usSave)
                return res.status(200).json(Service.response(0, localization.ServerError, null));

            console.log("After dave");
            console.log(usSave);
                
            var sendMailRes = await Mailer.sendResetEmail(usSave);
            logger.info("SEND MAIL RES", sendMailRes);
            if (sendMailRes) {
                return res.status(200).json(Service.response(1, localization.resetPasswordEmailSent, null));
            } 
            return res.status(200).json(Service.response(0, localization.resetPasswordEmailError, null));

        }else if(paramstype=="mobile"){

            if (isNaN(params.email) || params.email.trim().length != 10)
                return res.status(200).json(Service.response(0, localization.mobileValidationError, null));
            
            var us = await User.findOne({
                    "mobile_no.number": params.email
                });

            if (!us) {
                return res.status(200).json(Service.response(0, localization.mobileAccountDoesNotExistError, null));
            }

            if (us.reset_token) {
                if (us.reset_token.expired_at > new Date().getTime()) {
                    // Send success, no message
                    return res.status(200).json(Service.response(1, localization.resetEmailAlreadySent, null));
                }
            }
            
            var token = cryptr.encrypt(us._id);
            us.reset_token.value = token;
            us.reset_token.expired_at = new Date().getTime() + config.RESET_EMAIL_EXPIRED_IN_MINUTES * 60 * 1000;
            var usSave = await us.save();

            if (!usSave)
                return res.status(200).json(Service.response(0, localization.ServerError, null));

            logger.info('link', config.live_url + '/reset_password/' + usSave.reset_token.value);
            var urlLink = config.live_url + '/reset_password/' + usSave.reset_token.value;
            var mobile = us.mobile_no.country_code+""+us.mobile_no.number;
            console.log(mobile);
            // SEND MESSAGE OTP HERE
            Sms.sendResetPasswordLink(mobile, urlLink)
                .then(d => {
                    logger.info("link Sent", d);
                })
                .catch(e => {
                    logger.info("Link Send Error::", e);
                }); 
            
            return res.status(200).json(Service.response(1, localization.resetPasswordSMSSent, null));       
        
        }
        return res.status(200).json(Service.response(0, localization.invalidInputVale, null));
    },

    getStateList: async function (req, res) {
        
        var data = config.STATES_LIST; 
        return res.status(200).json(Service.response(1, localization.success, data));
    },

    pushTest: async function (req, res) {
        var startTime = new Date();

        //logger.info("Test Push Request >> ", req.body);

        var params = _.pick(req.body, "onesignal_id", "msg");

        if (_.isEmpty(params)) {
            return res
                .status(200)
                .json(Service.response(0, localization.missingParamError, null));
        }

        if (_.isEmpty(params.onesignal_id) || _.isEmpty(params.msg)) {
            //logger.info("required parameter is missing");
            return res
                .status(200)
                .json(Service.response(0, localization.missingParamError, null));
        }

        var message = {
            app_id: config.ONESIGNAL_APP_ID,
            contents: {
                en: params.msg
            },
            data: {
                method: "message"
            },
            include_player_ids: [params.onesignal_id]
        };

        Service.sendNotification(message)
            .then(data => {
                //logger.info("Push Sent");

                let endTime = new Date();
                utility.logElapsedTime(req, startTime, endTime, "pushTest");

                return res
                    .status(200)
                    .json(Service.response(1, localization.pushSuccess, data));
            })
            .catch(err => {
                logger.info("Push Error", err);

                let endTime = new Date();
                utility.logElapsedTime(req, startTime, endTime, "pushTest");

                return res
                    .status(200)
                    .json(Service.response(0, localization.pushError, null));
            });
    },

    referralRecords: async function (req, res) {
        var startTime = new Date();

        //logger.info("Referral Records Request >> ", req.body);
        var referrals = [];
        User.find({
            "referral.referred_by": req.user._id
        })
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    referrals.push({
                        // name: data[i].username,
                        name: data[i].name,
                        numeric_id: data[i].numeric_id,
                        matches: data[i].referral.matches,
                        amount: data[i].referral.amount
                    });
                }

                let endTime = new Date();
                utility.logElapsedTime(req, startTime, endTime, "referralRecords");

                //logger.info("REFERRALS", referrals);
                return res
                    .status(200)
                    .json(Service.response(1, localization.referralSuccess, referrals));
            })
            .catch(e => {
                console.log("ERR",e);

                return res
                    .status(200)
                    .json(Service.response(0, localization.serverError, null));
            });
    },

    //for caching functionality
    autoLogin: async function (req, res) {
        var startTime = new Date();

        //logger.info("Auto Login Request >> ", req.body);

        let autologin_totalWin = await Table.find({
            players: {
                $elemMatch: {
                    id: req.user._id,
                    pl: {
                        $gt: 0
                    }
                }
            }
        }).countDocuments();

        let autologin_totalMatch = await Table.find({
            players: {
                $elemMatch: {
                    id: req.user._id,
                    pl: {
                        $ne: 0
                    }
                }
            }
        }).countDocuments();

        var userdata = _.pick(
            req.user,
            "name",
            "email",
            // "age",
            // "state",
            "profilepic",
            "otp_verified",
            "numeric_id",
            "email_verified",
            "main_wallet",
            "win_wallet",
            "is_game_disclaimer",
            "facebook_id"
        );
        userdata.token = req.body.token;
        
        // const transactions = await paymentController.depositsTransactionsHistory(req.user._id);
        // userdata.deposits = transactions;

        userdata.deposits = req.user.main_wallet;    
        userdata.balance = parseInt(req.user.main_wallet) + parseInt(req.user.win_wallet);
        userdata.referral_code = req.user.referral.referral_code;
        userdata.mobileno = req.user.mobile_no.number;
        userdata.total_match = autologin_totalMatch || 0;
        userdata.total_win = autologin_totalWin || 0;

        let promo = await Promo.findOne({ is_active: true });
        userdata.promo_available = promo ? true : false;

        let endTime = new Date();
        utility.logElapsedTime(req, startTime, endTime, "autoLogin");

        const chatdata = await ChatTemplate.find({
            is_active: true,
        })
        .sort({
            text: 1
        });

        const templatelist = await Promise.all(
            chatdata.map(async u => {
                return {
                    id: u._id,
                    text: u.text,
                };
            })
        );

        let response={};
        response.userdata = userdata;
        response.chatdata = templatelist;    

        return res
            .status(200)
            .json(Service.response(1, localization.autologinSuccess, response));
    },

    verifyEmail: async function (req, res) {
    //logger.info("Verify Email Request >> ", req.params);

        var params = _.pick(req.params, "token");

        if (_.isEmpty(params)) {
            return res.render("verify_email.ejs", {
                status: 0,
                title: localization.linkInvalid
            });
        }

        if (_.isEmpty(params.token)) {
            return res.render("verify_email.ejs", {
                status: 0,
                title: localization.linkInvalid
            });
        }

        var user = await User.findOne({
            "email_token.value": params.token
        });

        if (!user) {
            return res.render("verify_email.ejs", {
                status: 0,
                title: localization.linkInvalid
            });
        }

        if (user.email_verified) {
            return res.render("verify_email.ejs", {
                status: 0,
                title: "Your email is already verified"
            });
        }

        if (user.email_token.expired_at < new Date().getTime()) {
            return res.render("verify_email.ejs", {
                status: 0,
                title: localization.linkExpired
            });
        }

        user.email_token.expired_at = 0;
        user.email_verified = true;

        // REFERRAL SYSTEM OLD [5 bonus per signup on verifying both accounts]
        // THIS USER EMAIL & OTP BOTH VERIFIED
        // REFERAL BONUS NOT PASSED ALREADY
        // GET REFERRAL USER
        // ADD BONUS IN REFERRAL USER MAIN WALLET
        // MARK AS REFERAL BONUS PASSED

        // logger.info("USER", user);

        // if (user.email_verified === true && user.otp_verified === true) {
        //   logger.info("VERIFIED");
        //   if (!user.ref_bonus_passed) {
        //     logger.info("NOT PASSED YET");
        //     // find user >> req.ref_user
        //     // add bonus in that user

        //     // let ref_user = await User.findOne({
        //     //     'ref_user': req.ref_user
        //     // });

        //     if (Service.validateObjectId(user.referral.referred_by)) {
        //       let ref_user = await User.findOne({
        //         _id: user.referral.referred_by
        //       });

        //       logger.info("Ref_User", ref_user);

        //       if (ref_user) {
        //         // ref_user.main_wallet = main_wallet + 5;
        //         let update_ = await User.findByIdAndUpdate(
        //           ref_user._id,
        //           {
        //             $inc: {
        //               main_wallet: config.ref_bonus
        //             }
        //           },
        //           {
        //             new: true
        //           }
        //         );
        //         logger.info("Referral User", update_.main_wallet);

        //         await User.findByIdAndUpdate(user._id, {
        //           $set: {
        //             ref_bonus_passed: true,
        //             "referral.amount": config.ref_bonus
        //           }
        //         });

        //         var order_id = utility.objectId();
        //         var newTxn = new Transaction({
        //           user_id: ref_user._id,
        //           txn_amount: config.ref_bonus,
        //           txn_win_amount: 0,
        //           txn_main_amount: config.ref_bonus,
        //           order_id: order_id,
        //           created_at: new Date().getTime(),
        //           transaction_type: "C",
        //           resp_msg: "Referral bonus for " + user.username,
        //           is_status: "S",
        //           txn_mode: "REF"
        //         });

        //         await newTxn
        //           .save()
        //           .then(c => {
        //             console.log("TXN SAVED", c);
        //           })
        //           .catch(err => {
        //             console.log("ERROR", err);
        //           });
        //       }
        //     }
        //   }
        // }

        var saveRez = await user.save();

        if (!saveRez) {
            return res.render("verify_email.ejs", {
                status: 0,
                title: localization.ServerError
            });
        } 
        return res.render("verify_email.ejs", {
            status: 1,
            title: localization.emailVerificationSuccess,
            msg: localization.emailVerificationSuccessMsg
        });
    
    },

    resendVerifyEmail: async function (req, res) {
    //logger.info("Resend Email Verification Link Request >> ", req.body);

        var params = _.pick(req.body, "token", "email");

        if (_.isEmpty(params)) {
            return res
                .status(200)
                .json(Service.response(0, localization.missingParamError, null));
        }

        if (_.isEmpty(params.token) || _.isEmpty(params.email)) {
            //logger.info("required parameter is missing");
            return res
                .status(200)
                .json(Service.response(0, localization.missingParamError, null));
        }

        if (!Service.validateEmail(params.email))
            return res
                .status(200)
                .json(Service.response(0, localization.emailValidationError, null));

        var us = await User.findOne({
            email: params.email.trim(),
            _id: {
                $ne: req.user._id
            }
        });

        if (us)
            return res
                .status(200)
                .json(Service.response(0, localization.emailExistError, null));

        var email_token = cryptr.encrypt(params.email);
        req.user.email = params.email;
        req.user.email_token.value = email_token;
        req.user.email_token.expired_at =
      new Date().getTime() + config.EMAIL_LINK_EXPIRED_IN_MINUTES * 60 * 1000;

        var newUserSave = await req.user.save();

        var userdata = _.pick(
            newUserSave,
            "name",
            "email",
            "profilepic",
            "otp_verified",
            "numeric_id",
            "email_verified",
            "main_wallet",
            "is_game_disclaimer",
            "win_wallet"
        );
        userdata.token = req.body.token;
        
        // const transactions = await paymentController.depositsTransactionsHistory(req.user._id);
        // userdata.deposits = transactions;

        userdata.deposits = req.user.main_wallet;
        userdata.balance = parseInt(req.user.main_wallet) + parseInt(req.user.win_wallet);
        userdata.referral_code = newUserSave.referral.referral_code;
        userdata.mobileno = newUserSave.mobile_no.number;

        if (!newUserSave)
            return res
                .status(200)
                .json(Service.response(0, localization.ServerError, null));

        var sendMailRes = await Mailer.sendWelcomeEmail(newUserSave);
        //logger.info("SEND MAIL RES", sendMailRes);
        if (sendMailRes) {
            //logger.info("Welcome Email Sent");
            return res
                .status(200)
                .json(Service.response(1, localization.emailSentSuccess, null));
        } 
        //logger.info("Welcome Email Error");
        return res
            .status(200)
            .json(Service.response(0, localization.ServerError, null));
    
    },

    passwordResetPageRender: async function (req, res) {
    //logger.info("Password Reset Page Render Request >> ", req.params);

        var params = _.pick(req.params, "token");

        if (_.isEmpty(params)) {
            return res.render("reset_password.ejs", {
                status: 0,
                title: localization.linkInvalid,
                host: config.pre + req.headers.host
            });
        }

        if (_.isEmpty(params.token)) {
            return res.render("reset_password.ejs", {
                status: 0,
                title: localization.linkInvalid,
                host: config.pre + req.headers.host
            });
        }

        var user = await User.findOne({
            "reset_token.value": params.token
        });

        if (!user) {
            return res.render("reset_password.ejs", {
                status: 0,
                title: localization.linkInvalid,
                host: config.pre + req.headers.host
            });
        }

        if (user.reset_token.expired_at < new Date().getTime()) {
            return res.render("reset_password.ejs", {
                status: 0,
                title: localization.linkExpired,
                host: config.pre + req.headers.host
            });
        }
        return res.render("reset_password.ejs", {
            status: 1,
            token: params.token
        });
    },

    passwordResetByWebPage: async function (req, res) {
    //logger.info("Change Password Through Webpage Request >> ", req.body);

        var params = _.pick(req.body, "pass_confirmation", "pass", "token");

        if (_.isEmpty(params)) {
            return res
                .status(200)
                .json(Service.response(0, localization.missingParamError, null));
        }

        if (
            _.isEmpty(params.pass_confirmation) ||
      _.isEmpty(params.pass) ||
      _.isEmpty(params.token)
        ) {
            //logger.info("required parameter is missing");
            return res
                .status(200)
                .json(Service.response(0, localization.missingParamError, null));
        }

        if (params.pass_confirmation != params.pass) {
            return res
                .status(200)
                .json(Service.response(0, localization.passwordNotMatchError, null));
        }

        var usr = await User.findOne({
            "reset_token.value": params.token
        });

        if (usr) {

            if (usr.reset_token.expired_at < new Date().getTime()) {
                return res
                    .status(200)
                    .json(Service.response(0, localization.linkExpired, null));
            }

            var hash = bcrypt.hashSync(params.pass_confirmation);
            usr.reset_token.value = "";
            usr.reset_token.expired_at = "0";
            usr.password = hash;
            var newUserSave = await usr.save();
            if (newUserSave)
                return res
                    .status(200)
                    .json(Service.response(1, localization.webPassSuccess, null));
            return res
                .status(200)
                .json(Service.response(0, localization.ServerError, null));
        } 
        return res
            .status(200)
            .json(Service.response(0, localization.ServerError, null));
    
    },

    updateStatus: async function (req, res) {
        var startTime = new Date();

        var params = _.pick(req.body, ["id", "status"]);
        //logger.info("PARAMS", params);
        if (!params)
            return res.send(
                Service.response(0, localization.missingParamError, null)
            );

        if (!Service.validateObjectId(params.id)) {
            return res.send(
                Service.response(0, localization.missingParamError, null)
            );
        }

        var rez = await User.findByIdAndUpdate(params.id, {
            $set: {
                is_active: params.status == "true"
            }
        });

        let endTime = new Date();
        utility.logElapsedTime(req, startTime, endTime, "updateStatus");

        if (rez) return res.send(Service.response(1, localization.success, null));
        return res.send(Service.response(0, localization.serverError, null));
    },

    sendSMSTest: function (req) {

        var mobile = "+919574882244";
        Sms.sendTest(mobile)
            .then(d => {
                logger.info("OPT Sent", d);
            })
            .catch(e => {
                logger.info("OTP Send Error::", e);
            });

    // //logger.info("SMS Test Request >> ", req.body);
    //     var otp = 123456;
    //     var projectname = config.project_name;
    //     var message =
    //   otp +
    //   " is your OTP (One Time Password) to verify your user account on " +
    //   projectname;
    //     return new Promise((resolve) => {
    //         request.post(
    //             "https://api.textlocal.in/send/",
    //             {
    //                 form: {
    //                     apikey: config.textLocalKey.apikey,
    //                     numbers: req.body.mobile,
    //                     message: message,
    //                     sender: config.textLocalKey.sender
    //                 }
    //             },
    //             function (error, response, body) {
    //                 if (response.statusCode == 200) {
    //                     logger.info('Response:', body);
    //                     var body_obj = JSON.parse(body);
    //                     if (body_obj.status == "success") {
    //                         logger.info("OTP Sent!");
    //                         return resolve(true);
    //                     } 
    //                     return resolve(false);
                        
    //                 } 
    //                 logger.info("Server Error", body);
    //                 return resolve(false);
                    
    //             }
    //         );
    //     });
    },

    getAppVersion: async function (req, res) {
        
        var version = await Default.findOne({
            key: "app_version"
            // whatsapp_no: '',
            // contact_email: ''
        });

        if (version){
            
            version = JSON.parse(JSON.stringify(version));

            var pooldata = await TableSeting.find({
                key: 'pool',
                type: "public"
            });

            const pooldatalist = await Promise.all(
                pooldata.map(async w => {
                    return w.value
                })
            );

            var playersdata = await TableSeting.find({
                key: 'players',
                type: "public"
            });

            const playersdatalist = await Promise.all(
                playersdata.map(async w => {
                    return w.value
                })
            );
            var noOfPlayersInPublic = [];
            for (d of config.noOfPlayersInPublic){
                if (!playersdatalist.includes(parseInt(d))) { 
                    noOfPlayersInPublic.push(d);
                }
            }   
            var roomFees = [];
            for (d of config.roomFees){
                if (!pooldatalist.includes(parseInt(d))) { 
                    roomFees.push(d);
                }
            }   
            version.public = {
                players:noOfPlayersInPublic,
                room_fee: roomFees
            };

            // version.public = {
            //     players:config.noOfPlayersInPublic,
            //     room_fee: config.roomFees
            // };

            var pooldata = await TableSeting.find({
                key: 'pool',
                type: "private"
            });

            const pooldatalistPrivate = await Promise.all(
                pooldata.map(async w => {
                    return w.value
                })
            );

            var playersdata = await TableSeting.find({
                key: 'players',
                type: "private"
            });

            const playersdatalistPrivate = await Promise.all(
                playersdata.map(async w => {
                    return w.value
                })
            );
            var noOfPlayersInPrivate = [];
            for (d of config.noOfPlayersInPrivate){
                if (!playersdatalistPrivate.includes(parseInt(d))) { 
                    noOfPlayersInPrivate.push(d);
                }
            }   
            var roomFeesPrivate = [];
            for (d of config.roomFeesPrivate){
                if (!pooldatalistPrivate.includes(parseInt(d))) { 
                    roomFeesPrivate.push(d);
                }
            }  
            
            version.private = {
                players:noOfPlayersInPrivate,
                room_fee: roomFeesPrivate
            };
           
            // version.private = {
            //     players:config.noOfPlayersInPrivate,
            //     room_fee: config.roomFeesPrivate
            // };

            return res.send(Service.response(1, localization.success, version));
        }
        return res.send(Service.response(0, localization.ServerError, null));
    },

    getDisclaimer: async function (req, res) {
        
        var appdata = await Default.findOne({
            key: "app_disclaimer"
        });
        
        if (appdata && appdata.data){
            let data=appdata.data;
            return res.send(Service.response(1, localization.success, data));
        }
        return res.send(Service.response(0, localization.ServerError, null));
    },

    getChatTemplates: async function (req, res) {
        
        const chatdata = await ChatTemplate.find({
            is_active: true,
        })
        .sort({
            text: 1
        });

        const templatelist = await Promise.all(
            chatdata.map(async u => {
                return {
                    id: u._id,
                    text: u.text,
                };
            })
        );
        
        return res.send(Service.response(1, localization.success, templatelist));
        
    },

    getMessageList: async function (req, res) {
        

        // var UserMessage = require('../models/userMessage')
     
        const msgData = await UserMessage.find({
            user_id: req.user._id,
        })
        .sort({
            created_at: -1
        });
       
        const msgDataList = await Promise.all(
            msgData.map(async u => {
                return {
                    id: u._id,
                    title: u.title,
                    content: u.content,
                    created_at: u.created_at,
                };
            })
        );
        
        return res.send(Service.response(1, localization.success, msgDataList));
        
    },
     
    getDeleteMessageList: async function (req, res) {


        try {

            const params = req.body;
            console.log("Deleted Message Request:", params);
           
            if (_.isEmpty(params)) {
                return res
                    .status(200)
                    .json(Service.response(0, localization.missingParamError, null));
            }
            if (_.isEmpty(params.id)) {
                return res
                    .status(200)
                    .json(Service.response(0, localization.missingParamError, null));
            }

            if(params.id=="all"){
                
                const msgData = await UserMessage.deleteMany({
                    user_id: req.user._id,
                });
                console.log("delete response = "+ msgData);


            }else{
                const msgData = await UserMessage.deleteOne({
                    _id: params.id,
                    user_id: req.user._id,
                })
                console.log("delete response = "+ msgData);
            }
            return res.send(Service.response(1, localization.success, null));
       
        }catch (err) {
            
            return res.send(
                Service.response(0, localization.ServerError, err.message)
            );
        }
        
    },
    

    getUserListAjax: async (req, res) => {
        var startTime = new Date();

        try {
            const params = req.query;

            //logger.info(params.search.value)

            let obj = {};
            if (params.search) {
                if (params.search.value.trim() != "") {
                    obj["$or"] = [
                        {
                            // username: {
                            //     $regex: params.search.value,
                            //     $options: "i"
                            // }
                            name: {
                                $regex: params.search.value,
                                $options: "i"
                            }
                        },
                        {
                            "mobile_no.number": {
                                $regex: params.search.value,
                                $options: "i"
                            }
                        }
                    ];
                }
            }

            //logger.info('Object to Search :: ', obj);

            let list = await User.find(obj)
                .sort({ created_at: -1 })
                .skip(parseInt(params.start))
                .limit(params.length == -1 ? "" : parseInt(params.length));

            list = await Promise.all(
                list.map(async u => {
                    //logger.info('Found User :: ', u);
                    let gamePlayedCount = await Table.find({
                        "players.id": u._id
                    }).countDocuments();
                    return [
                        // u.username,
                        u.name,
                        `${u.mobile_no.country_code} ${u.mobile_no.number}`,
                        gamePlayedCount,
                        u.main_wallet,
                        u.win_wallet,
                        u.created_at,
                        `<small class="label bg-${
                            u.email_verified && u.otp_verified ? "green" : "red"
                        }">${
                            u.email_verified && u.otp_verified ? "Verified" : "Unverified"
                        }</small>`,
                        `<a href="${config.pre + req.headers.host}/user/view/${
                            u._id
                        }" class="on-editing save-row"><i class="fa fa-eye"></i></a>`
                    ];
                })
            );

            let total = await User.find({}).countDocuments();
            let total_f = await User.find(obj).countDocuments();

            let endTime = new Date();
            utility.logElapsedTime(req, startTime, endTime, "getUserListAjax");

            return res.status(200).send({
                data: list,
                draw: new Date().getTime(),
                recordsTotal: total,
                recordsFiltered: total_f
            });
        } catch (err) {
            let endTime = new Date();
            utility.logElapsedTime(req, startTime, endTime, "getUserListAjax");

            return res.send(
                Service.response(0, localization.ServerError, err.message)
            );
        }
    },

    findUser: async (req, res) => {
        var startTime = new Date();

        try {
            const params = _.pick(req.query, ["search"]);

            let aggregate_obj = [];
            if (params.search) {
                if (params.search.trim() != "") {
                    aggregate_obj.push({
                        $match: {
                            // username: {
                            //     $regex: params.search,
                            //     $options: "i"
                            // }
                            name: {
                                $regex: params.search,
                                $options: "i"
                            }
                        }
                    });
                }
            }

            aggregate_obj.push(
                {
                    $sort: {
                        // username: 1
                        name: 1
                    }
                },
                {
                    $limit: 10
                },
                {
                    $project: {
                        id: "$_id",
                        // text: "$username"
                        text: "$name"
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            );

            let users = await User.aggregate(aggregate_obj);

            let endTime = new Date();
            utility.logElapsedTime(req, startTime, endTime, "findUser");

            return res.send({ results: users });
        } catch (err) {
            logger.info("ERR", err);
            let endTime = new Date();
            utility.logElapsedTime(req, startTime, endTime, "findUser");

            return res.send({ results: [] });
        }
    },

    getPromoVideos: async (req, res) => {
        try {

            // let promo = new Promo({
            //   title:'Dolby digital',
            //   url:'https://ludo-circle.s3.ap-south-1.amazonaws.com/videos/dolbycanyon.mp4',
            //   is_active:true,
            //   created_at: new Date().getTime()
            // });

            // await promo.save();

            let list = await Promo.aggregate([
                {
                    $match: {
                        is_active: true
                    }
                }, {
                    $sort: {
                        created_at: -1
                    }
                }, {
                    $limit: 30
                }, {
                    $project: {
                        id: '$_id',
                        _id: 0,
                        title: 1,
                        url: 1,
                        created_at: 1
                    }
                }
            ]);

            // let promos = await Promo.find
            return res.send(Service.response(1, localization.success, list));

        } catch (err) {
            logger.info("ERR", err);
            return res.send(Service.response(0, localization.ServerError, null));
        }
    }
};
