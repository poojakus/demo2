var UserController = require('../api/controller/userController');
var PaymentController = require('../api/controller/paymentController');
var Service = require('../api/service');
const { Default } = require('../api/models/default');
const config = require('./../config');
const MAILER = require('./../api/service/email');
const _ = require('lodash');

module.exports = function (router,io) {
    
    router.get('/app_version/', function(req, res) {
        return UserController.getAppVersion(req, res);
    });

    router.get('/get-disclaimer-data/', function(req, res) {
        return UserController.getDisclaimer(req, res);
    });

    router.get('/get-chat-templates/', function(req, res) {
        return UserController.getChatTemplates(req, res);
    });
    
    router.options('/contact-submit', (req, res) => {
        res.status(200).send('OK')
    });

    router.post('/contact-submit', (req, res) => {
        let params = _.pick(req.body, ['name', 'email', 'subject','mobile_no', 'message']);
        console.log("CONTACT FORM REQUEST",req.body); 
        if (
            _.isEmpty(params.name) ||
            _.isEmpty(params.email) ||
            _.isEmpty(params.mobile_no) ||
            isNaN(params.mobile_no) ||
            _.isEmpty(params.subject) ||
            _.isEmpty(params.message)
        ) {
            return res.send({ status: 0, message: 'Please fill all details in to continue.' });
        }

        if (!Service.validateEmail(params.email)) return res.send({ status: 0, message: 'Invalid email address provided.' });

        if (params.mobile_no.length != 10) return res.send({ status: 0, message: 'Please share a valid mobile number' });

        MAILER.sendContactEmail(params)
            .then(function(data) {
                console.log('EMAIL FIRED', data);
                return res.send({ status: 1, message: 'Contact request submitted successfully, \n\n our team will get in touch with you soon.' })
            })
            .catch(function(err) {
                console.log('ERROR SENDING EMAIL', err);
                return res.send({ status: 0, message: 'Something went wrong, please try again later!' })
            });
    });

    router.post('/testtxn/:uid', function(req, res) {
        return PaymentController.testtxnPost(req, res);
    });

    // router.get('/pgredirect/', function(req, res) {
    //     return PaymentController.pgredirect(req, res);
    // });

    router.post('/testemail', function(req, res) {
        return UserController.testMail(req, res,io);
    });

    router.post('/response/', function(req, res) {
        return PaymentController.response(req, res);
    });

    router.use(async function(req, res, next) {
        var version = await Default.findOne({
            key: 'app_version'
        });

        if (version) {
            if (version.undermaintenance == 'Y') {
                if (req.body) {
                    if (req.body['session-data']) {
                        if (req.body['session-data'] == config.secret_session_data) {
                            next();
                        } else return res.send(Service.response(0, 'SERVER IS UNDER MAINTENANCE', null));
                    } else return res.send(Service.response(0, 'SERVER IS UNDER MAINTENANCE', null));
                } else return res.send(Service.response(0, 'SERVER IS UNDER MAINTENANCE', null));
            } else next();
        } else next();
    });

    router.post('/signup', function(req, res) {
        return UserController.signup(req, res,io);
    });

    router.post('/fb_login', function(req, res) {
        return UserController.fblogin(req, res);
    });

    router.post('/login', function(req, res) {
        return UserController.login(req, res);
    });

    router.post('/otp_verify', function(req, res) {
        return UserController.verify_otp(req, res);
    });

    router.post('/send_otp', Service.authenticate, function(req, res) {
        return UserController.sendOtp(req, res);
    });

    router.post('/profile_update', Service.authenticate, function(req, res) {
        return UserController.profileUpdate(req, res);
    });

    router.post('/wheel-status', Service.authenticate, function(req, res) {
        return UserController.spinWheelStatus(req, res);
    });
   
    router.post('/spin-wheel', Service.authenticate, function(req, res) {
        return UserController.spinWheel(req, res);
    });


    router.post('/password_update', Service.authenticate, function(req, res) {
        return UserController.updatePassword(req, res);
    });

    router.post('/update_disclaimer', Service.authenticate, function(req, res) {
        return UserController.updateDisclaimer(req, res);
    });

    router.post('/reset_password', function(req, res) {
        return UserController.passwordReset(req, res);
    });

    router.get('/reset_password/:token', function(req, res) {
        return UserController.passwordResetPageRender(req, res);
    });

    router.get('/get-states-list', function(req, res) {
        return UserController.getStateList(req, res);
    });

    router.post('/push_test', function(req, res) {
        return UserController.pushTest(req, res);
    });

    router.post('/referral_records', Service.authenticate, function(req, res) {
        return UserController.referralRecords(req, res);
    });

    router.post('/auto_login', Service.authenticate, function(req, res) {
        return UserController.autoLogin(req, res);
    });

    router.get('/verify_email/:token', function(req, res) {
        return UserController.verifyEmail(req, res);
    });

    router.post('/resend_verify_email/', Service.authenticate, function(req, res) {
        return UserController.resendVerifyEmail(req, res);
    });

    router.post('/transactions_history/', Service.authenticate, function(req, res) {
        return PaymentController.transactionsHistory(req, res);
    });

    router.post('/transactions_list', Service.authenticate, function(req, res) {
        return PaymentController.transactionsListData(req, res);
    });

    router.post('/get-message', Service.authenticate, function(req, res) {
        return UserController.getMessageList(req, res);
    });

    router.post('/delete-message', Service.authenticate, function(req, res) {
        return UserController.getDeleteMessageList(req, res);
    });
   
    router.post('/withdrawal_request/', Service.authenticate, function(req, res) {
        return PaymentController.withdrawRequest(req, res);
    });

    router.post('/reset_password_web/', function(req, res) {
        return UserController.passwordResetByWebPage(req, res);
    });

    router.get('/testtxn/:uid', function(req, res) {
        return PaymentController.testtxnGet(req, res);
    });

    router.post('/game_history/', Service.authenticate, function(req, res) {
        return PaymentController.gameRecords(req, res);
    });

    router.post('/promo-videos/', Service.authenticate, function(req, res) {
        return UserController.getPromoVideos(req, res);
    });

    router.post('/withdrawl_history/', Service.authenticate, function(req, res) {
        return PaymentController.withdrawHistory(req, res);
    });

    router.post('/smstest/', async function(req, res) {
        return res.send(await UserController.sendSMSTest(req, res));
    });
};
