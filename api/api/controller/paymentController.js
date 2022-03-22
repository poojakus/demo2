var { User } = require('./../models/user'),
    config = require('./../../config'),
    _ = require('lodash'),
    Service = require('./../service'),
    localization = require('./../service/localization');
var Cryptr = require('cryptr');
var { Transaction } = require('./../models/transaction');
var Table = require('./../models/table');
var { WithdrawalRequest } = require('./../models/WithdrawalRequest');
const uniqid = require('uniqid');

var logger = require('./../service/logger');

cryptr = new Cryptr(config.cryptrSecret);

var ObjectId = require('mongoose').Types.ObjectId;

var checksum = require('../../api/service/paytm/checksum');

var utility = require('./utilityController');

module.exports = {
    pgredirect: async function(req, res) {
        // logger.info("in pgdirect");
        // logger.info("--------testtxnjs----");
        return res.render('pgredirect.ejs');
    },

    testtxnGet: async function(req, res) {
        var startTime = new Date();
        // logger.info("Add Money Request >> ", req.params);
        var params = _.pick(req.params, 'uid');

        var user = await User.findOne({
            numeric_id: params.uid
        });

        if (!user) {
            var endTime = new Date();
            utility.logElapsedTime(req, startTime, endTime, 'testTXNGet');

            return res.render('testtxn.ejs', {
                status: 0,
                title: localization.tokenExpired
            });
        } else {
            var order_id = utility.objectId();

            logger.info('order_id---->', order_id);
            var data = _.pick(user, '_id', 'name', 'main_wallet', 'numeric_id');
            data.order_id = order_id;
            data.user_id = data._id;

            var endTime = new Date();
            utility.logElapsedTime(req, startTime, endTime, 'testTXNGet');

            res.render('testtxn.ejs', {
                status: 1,
                data: data,
                host: config.pre + req.headers.host
            });
        }
    },

    testtxnPost: async function(req, res) {

        try{
            var startTime = new Date();

            var paramarray = _.pick(
                req.body,
                'CUST_ID',
                'TXN_AMOUNT'
            );
            paramarray.ORDER_ID = utility.objectId();
            paramarray.PAYMENT_MODE_ONLY = 'YES';
            paramarray.PAYMENT_TYPE_ID = 'PPI';
            paramarray.CALLBACK_URL = config.live_url + '/response';
            paramarray.MERC_UNQ_REF = req.body.USERID;
            paramarray.MID = config.PAYTM.MID;
            paramarray.INDUSTRY_TYPE_ID = config.PAYTM.INDUSTRY_TYPE_ID;
            paramarray.CHANNEL_ID = config.PAYTM.CHANNEL_ID;
            paramarray.WEBSITE = config.PAYTM.WEBSITE;

            checksum.genchecksum(paramarray, config.PAYTM.MERCHANT_KEY, async function(err, result) {

                if(_.isEmpty(result.TXN_AMOUNT) || isNaN(result.TXN_AMOUNT)){
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'testTXNPost');

                    return res.render('pgredirect.ejs', {
                        status: 0,
                        redirect_url: config.PAYTM.URL + config.PAYTM.PROCESS_TRANSACTION,
                        msg: localization.ServerError
                    });
                }

                var newOrder = new Transaction({
                    user_id: result.MERC_UNQ_REF,
                    txn_amount: result.TXN_AMOUNT,
                    txn_win_amount: 0,
                    txn_main_amount: result.TXN_AMOUNT,
                    order_id: result.ORDER_ID,
                    created_at: new Date().getTime(),
                    txn_id: '',
                    checksum:result,
                    main_wallet_closing: 0,
                    win_wallet_closing: 0,
                    transaction_type: 'C',
                    txn_mode: 'P'
                });

                var newOrderSave = await newOrder.save();

                if (!newOrderSave) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'testTXNPost');

                    return res.render('pgredirect.ejs', {
                        status: 0,
                        redirect_url: config.PAYTM.URL + config.PAYTM.PROCESS_TRANSACTION,
                        msg: localization.ServerError
                    });
                } else {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'testTXNPost');

                    return res.render('pgredirect.ejs', {
                        status: 1,
                        redirect_url: config.PAYTM.URL + config.PAYTM.PROCESS_TRANSACTION,
                        restdata: result
                    });
                }
            });
        } catch(err) {
            console.log("TXN EXCEPTION",err);
            return res.render('pgredirect.ejs', {
                status: 0,
                redirect_url: config.PAYTM.URL + config.PAYTM.PROCESS_TRANSACTION,
                msg: localization.ServerError
            });
        }

    },

    response: async function(req, res) {
        var startTime = new Date();

        // logger.info("in response post");
        var paramlist = req.body;
        var paramarray = _.pick(paramlist, 'ORDERID', 'MID', 'TXNID', 'TXNAMOUNT', 'STATUS', 'RESPMSG', 'MERC_UNQ_REF');

        console.log('PARAMARRAY', paramarray);
        if (checksum.verifychecksum(paramlist, config.PAYTM.MERCHANT_KEY)) {
            // logger.info("true");
            var status;
            if (paramarray.STATUS == 'TXN_SUCCESS' && paramarray.RESPMSG == 'Txn Success') {
                status = 'S';
            } else if (paramarray.STATUS == 'PENDING') {
                status = 'P';
            } else {
                status = 'F';
            }

            var filter = {
                order_id: paramarray.ORDERID,
                user_id: paramarray.MERC_UNQ_REF,
                is_status: 'P'
            };
            var update = {
                txn_id: paramarray.TXNID,
                is_status: status,
                resp_msg: paramarray.RESPMSG
            };

            var order = await Transaction.findOne(filter);

            if (order) {
                console.log('UPDATE', update);
                var orderUpdate = await order.updateOne(update);
                if (orderUpdate) {
                    var user = await User.findOne({
                        _id: paramarray.MERC_UNQ_REF
                    });

                    if (user) {
                        // user.main_wallet = user.main_wallet + parseInt(paramarray.TXNAMOUNT);
                        // var balnceUpdate = await user.save();
                        if (status == 'S') {
                            user.main_wallet = user.main_wallet + parseInt(paramarray.TXNAMOUNT);
                            var balnceUpdate = await user.save();
                        }

                        if (balnceUpdate) {
                            //logger.info('true');
                            var endTime = new Date();
                            utility.logElapsedTime(req, startTime, endTime, 'response');

                            res.render('response.ejs', {
                                status: 1,
                                msg: localization.paymentSuccess,
                                host: config.pre + req.headers.host
                            });
                        } else {
                            //logger.info("false");
                            var endTime = new Date();
                            utility.logElapsedTime(req, startTime, endTime, 'response');

                            return res.render('response.ejs', {
                                status: 0,
                                msg: localization.paymentFailed,
                                host: config.pre + req.headers.host
                            });
                        }
                    } else {
                        //logger.info("false");
                        var endTime = new Date();
                        utility.logElapsedTime(req, startTime, endTime, 'response');

                        return res.render('response.ejs', {
                            status: 0,
                            msg: localization.paymentFailed,
                            host: config.pre + req.headers.host
                        });
                    }
                } else {
                    //logger.info("false");
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'response');

                    return res.render('response.ejs', {
                        status: 0,
                        msg: localization.paymentFailed,
                        host: config.pre + req.headers.host
                    });
                }
            } else {
                //logger.info("false");
                console.log('ORDER NOT FOUND');
                var endTime = new Date();
                utility.logElapsedTime(req, startTime, endTime, 'response');

                return res.render('response.ejs', {
                    status: 0,
                    msg: localization.paymentFailed
                });
            }
        } else {
            //logger.info("false");
            console.log('CHECKSUM FAILED');
            var endTime = new Date();
            utility.logElapsedTime(req, startTime, endTime, 'response');

            return res.render('response.ejs', {
                status: 0,
                msg: localization.paymentFailed
            });
        }
    },

    // for cache implementation
    transactionsListData: async function(req, res) {
        
        console.log(req.body);

        var dataTYpe="all";
        if(req.body.type){
            dataTYpe = req.body.type; 
        }
        var userHistory;

        if(dataTYpe=="deposits"){
            
            userHistory = await Transaction.find({
                $or: [
                    {
                        user_id: req.user._id,
                        transaction_type: { $ne: 'D' },
                        txn_mode: { $ne: 'G' }
                    },
                    
                ]
            });

        }else if(dataTYpe=="winwallet"){
            
            userHistory = await Transaction.find({
                $or: [
                    {
                        user_id: req.user._id,
                        txn_mode:'G'
                    },
                    
                ]
            });

        }else{

            userHistory = await Transaction.find({
                $or: [
                    {
                        user_id: req.user._id,
                    },
                    
                ]
            });

        }    
        
        userHistory = userHistory.map(d => {
            
            var type = "";
            if(d.txn_mode=="SB"){
                type = "Signup Bonus";
            }else if(d.txn_mode=="C"){
                type = "Credit";
            }else if(d.txn_mode=="P"){
                type = "Paytm";
            }else if(d.txn_mode=="A"){
                type = "Admin Bonus";
            }else if(d.txn_mode=="R"){
                type = "Refund";
            }else if(d.txn_mode=="SW"){
                type = "Spin Wheel";
            }else {
                type = "Game";
            }
            return {
                id: d._id,
                status: d.is_status,
                txn_amount: d.txn_amount,
                txn_win_amount: d.txn_win_amount || 0,
                txn_main_amount: d.txn_main_amount || 0,
                txn_type: type,
                remarks: d.resp_msg,
                created_at: d.created_at
            };
        });
       
        return res.status(200).json(Service.response(1, localization.TransactionsHistory, userHistory));
    },


    //Get User List
    depositsTransactionsHistory: async userId => {

        userHistory = await Transaction.find({
            $or: [
                {
                    user_id: userId,
                    transaction_type: { $ne: 'D' },
                    txn_mode: { $ne: 'G' },
                    is_status: "S"
                },
                
            ]
        });
        var total=0;
        userHistory = userHistory.map(d => {
            total = parseInt(total)+parseInt(d.txn_amount);
        });
        return total;

    },

    WinningTransactionsHistory: async function(req, res) {

        var startTime = new Date();
        var key_userTransactionHistory = 'userTransactionHistory' + req.user._id;
       
        userHistory = await Transaction.find({
            $or: [
                {
                    user_id: req.user._id,
                    txn_mode: 'G' 
                },
                
            ]
        });
        userHistory = userHistory.map(d => {
            return {
                id: d._id,
                status: d.is_status,
                txn_amount: d.txn_amount,
                txn_win_amount: d.txn_win_amount || 0,
                txn_main_amount: d.txn_main_amount || 0,
                txn_type: d.txn_mode || 'G',
                remarks: d.resp_msg,
                created_at: d.created_at
            };
        });

        var endTime = new Date();
        utility.logElapsedTime(req, startTime, endTime, 'transactionHistory');

        return res.status(200).json(Service.response(1, localization.TransactionsHistory, userHistory));
    },


    // for cache implementation
    transactionsHistory: async function(req, res) {
        var startTime = new Date();

        //logger.info("Transactions History Request >> ", req.user._id);

        var key_userTransactionHistory = 'userTransactionHistory' + req.user._id;

        userHistory = await Transaction.find({
            $or: [
                {
                    user_id: req.user._id,
                    transaction_type: { $ne: 'D' }
                },
                {
                    user_id: req.user._id,
                    txn_mode: { $ne: 'A' }
                }
            ]
        });

        userHistory = userHistory.map(d => {
            return {
                status: d.is_status,
                txn_amount: d.txn_amount,
                txn_win_amount: d.txn_win_amount || 0,
                txn_main_amount: d.txn_main_amount || 0,
                txn_type: d.txn_mode || 'G',
                remarks: d.resp_msg,
                created_at: d.created_at
            };
        });

        var endTime = new Date();
        utility.logElapsedTime(req, startTime, endTime, 'transactionHistory');

        return res.status(200).json(Service.response(1, localization.TransactionsHistory, userHistory));
    },

    transactionList: async limit => {
        //var startTime = new Date();

        const transaction = await Transaction.find({})
            .populate('user_id')
            .sort({
                order_id: -1
            })
            .limit(limit);
        // const totalcount = await Transaction.find({}).populate('user_id').sort({'order_id': -1}).countDocuments();
        // logger.info("Total Count", totalcount);
        let list = await Promise.all(
            transaction.map(async u => {
                //logger.info("User Transaction",u);
                if (u.user_id) {
                    return {
                        // 'id':u.user_id,
                        order_id: u.order_id,
                        username: _.capitalize(u.user_id.username),
                        user_id: u.user_id._id,
                        txn_amount: u.txn_amount,
                        win_wallet: u.txn_win_amount || 0,
                        main_wallet: u.txn_main_amount || 0,
                        created_at: u.created_at, //await Service.formateDateandTime(parseInt(u.created_at)),
                        is_status: u.is_status,
                        msg: u.resp_msg || 'No Data Found',
                        txn_mode: u.txn_mode || 'G'
                    };
                } else {
                    return false;
                }
            })
        );
        //list = list.filter(d => d);
        let count = await Transaction.countDocuments();

        // var endTime = new Date();
        // utility.logElapsedTime(req, startTime, endTime, "transactionList");

        return {
            list: list.filter(d => d),
            count: count
        };
        //return {'list':list,'total':totalcount};
    },

    //All Game records for admin
    allGameRecords: async limit => {
        //var startTime = new Date();

        var allGameRecords = await Table.find({
            players: {
                $ne: []
            }
        })
            .sort({
                created_at: -1
            })
            .limit(limit);

        var gData = await Promise.all(
            allGameRecords.map(async u => {
                const players = [];
                for (const us of u.players) {
                    if (Service.validateObjectId(us.id)) {
                        const user = await User.findById(us.id);
                        players.push({
                            id: user._id,
                            username: user.username,
                            rank: us.rank,
                            pl: us.pl
                        });
                    }
                }
                return {
                    room: u.room,
                    type: u.room_type,
                    players: u.no_of_players,
                    amount: u.room_fee,
                    date: u.created_at,
                    pdata: players
                };
            })
        );

        //var endTime = new Date();
        //utility.logElapsedTime(req, startTime, endTime, "allGameRecords");

        logger.info(gData);
        return gData;
    },

    getTxnAjax: async function(req, res) {
        var startTime = new Date();

        const params = req.query;

        let matchObj = {};

        const user_id = params.id || '';

        if (Service.validateObjectId(user_id)) {
            matchObj.user_id = ObjectId(user_id);
        }

        let ORR = [];

        if (params.search.value.trim() != '') {
            ORR = [];

            if (!isNaN(params.search.value)) {
                ORR.push({
                    order_id: parseInt(params.search.value)
                });
            }

            ORR.push({
                resp_msg: {
                    $regex: params.search.value,
                    $options: 'i'
                }
            });

            // matchObj['$or'].push({
            //     'users.username': {
            //         "$regex": params.search.value,
            //         "$options": "i"
            //     }
            // });

            if (_.toLower(params.search.value) == 'pending') {
                ORR.push({
                    is_status: 'P'
                });
            }
            if (_.toLower(params.search.value) == 'failed') {
                ORR.push({
                    is_status: 'F'
                });
            }
            if (_.toLower(params.search.value) == 'success') {
                ORR.push({
                    is_status: 'S'
                });
            }
        }

        let aggregation_obj = [];

        if (ORR.length > 0) {
            matchObj['$or'] = ORR;
        }

        logger.info('OBJMATCH', matchObj);

        if (matchObj != {})
            aggregation_obj.push({
                $match: matchObj
            });

        aggregation_obj.push(
            {
                $sort: {
                    created_at: -1
                }
            },
            {
                $skip: params.start == 'All' ? 0 : parseInt(params.start)
            }
            // limit
            // { $limit: params.length == -1 ? null :  parseInt(params.length) },
        );

        if (params.length != -1) {
            aggregation_obj.push({
                $limit: parseInt(params.length)
            });
        }

        aggregation_obj.push(
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            {
                $unwind: '$users'
            }
        );

        aggregation_obj.push({
            $project: {
                _id: 1,
                txn_win_amount: 1,
                txn_main_amount: 1,
                created_at: 1,
                txn_amount: 1,
                username: '$users.username',
                user_id: '$users._id',
                resp_msg: 1,
                order_id: 1,
                is_status: 1,
                txn_mode: 1
            }
        });

        logger.info('AGGRE', JSON.stringify(aggregation_obj, undefined, 2));

        let list = await Transaction.aggregate(aggregation_obj);

        let aggregate_rf = [];

        if (matchObj) {
            aggregate_rf.push({
                $match: matchObj
            });
        }

        aggregate_rf.push({
            $group: {
                _id: null,
                count: { $sum: 1 }
            }
        });

        logger.info('aggregate_rf', aggregate_rf);
        let rF = await Transaction.aggregate(aggregate_rf);

        logger.info('RF', rF);
        let recordsFiltered = rF.length > 0 ? rF[0].count : 0;
        var recordsTotal = await Transaction.find({}).countDocuments();

        list = await Promise.all(
            list.map(async u => {
                //logger.info("User Transaction",u);
                let txn_amount = u.txn_amount;
                if (u.txn_amount > 0) {
                    txn_amount = '<span class="label label-success">' + u.txn_amount + '</span>';
                } else {
                    txn_amount = '<span class="label label-danger">' + u.txn_amount + '</span>';
                }

                let payment_mode = u.txn_mode;
                if (u.txn_mode == 'G') {
                    payment_mode = 'GAME';
                } else if (u.txn_mode == 'P') {
                    payment_mode = 'PAYTM';
                } else {
                    payment_mode = 'ADMIN';
                }

                let status_ = u.is_status;

                if (status_ == 'P') {
                    status_ = '<span class="label label-warning">Pending</span>';
                } else if (status_ == 'S') {
                    status_ = '<span class="label label-success">Success</span>';
                } else {
                    status_ = '<span class="label label-danger">Failed</span>';
                }

                return [
                    u.order_id,
                    `<a href="${config.pre + req.headers.host}/user/view/${u.user_id}">${_.capitalize(u.username)}</a>`,
                    txn_amount,
                    u.txn_win_amount || 0,
                    u.txn_main_amount || 0,
                    // `<div class="time_formateDateandTime2">${u.created_at}</div>`,
                    u.created_at,
                    payment_mode,
                    u.resp_msg ? u.resp_msg : 'No Data Found',
                    status_
                ];
            })
        );

        var endTime = new Date();
        utility.logElapsedTime(req, startTime, endTime, 'getTXNAjax');

        return res.status(200).send({
            data: await list,
            draw: new Date().getTime(),
            recordsTotal: recordsTotal,
            recordsFiltered: recordsFiltered
        });
    },

    withdrawRequest: async (req, res) => {
        var startTime = new Date();

        try {
            const params = _.pick(req.body, [
                'amount',
                'account_name',
                'account_no',
                'bank_name',
                'ifsc_code',
                'payment_type',
                'mobile_no',
                'upi_id'
            ]);
            //logger.info('Withdrawal Request :: ', params);

            if (_.isEmpty(params.payment_type)) {
                var endTime = new Date();
                utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if (params.amount <= 0) {
                var endTime = new Date();
                utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                return res.status(200).json(Service.response(0, localization.invalidAmountError, null));
            }

            if (
                params.payment_type.trim() != 'paytm' &&
                params.payment_type.trim() != 'bank' &&
                params.payment_type.trim() != 'phonepe' &&
                params.payment_type.trim() != 'google_pay'
            ) {
                var endTime = new Date();
                utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                return res.status(200).json(Service.response(0, localization.paymentTypeValidationError, null));
            }

            if (us.win_wallet < params.amount) {
                var endTime = new Date();
                utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                return res.status(200).json(Service.response(0, localization.insufficientWithdrawlError, null));
            }

            if (params.payment_type == 'paytm') {
                if (_.isEmpty(params.amount) || _.isEmpty(params.mobile_no)) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                    return res.status(200).json(Service.response(0, localization.missingParamError, null));
                }

                const us = await User.findById(req.user._id);

                if (!us) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                    return res.status(200).json(Service.response(0, localization.ServerError, null));
                }

                if (params.amount < config.paytm_min_withdraw_limit) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                    return res.status(200).json(Service.response(0, localization.minWithdrawalLimit+config.paytm_min_withdraw_limit, null));
                }

                if (us.win_wallet < params.amount) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                    return res.status(200).json(Service.response(0, localization.insufficientWithdrawlError, null));
                }

                if (!us.otp_verified) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                    return res.status(200).json(Service.response(0, localization.accountVerifiedError, null));
                }

                const wq = new WithdrawalRequest({
                    user_id: us._id,
                    amount: params.amount,
                    payment_type: params.payment_type,
                    mobile_no: params.mobile_no,
                    created_at: new Date().getTime()
                });

                us.win_wallet = us.win_wallet - params.amount;
                var t = await us.save();
                // if (t) {
                //     logger.info("amount deducted", us.win_wallet);
                // }
                const rez = await wq.save();

                if (!rez) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                    return res.status(200).json(Service.response(0, localization.ServerError, null));
                }
                var endTime = new Date();
                utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                return res.status(200).json(Service.response(1, localization.success, null));
            }

            if (params.payment_type == 'bank') {
                if (
                    _.isEmpty(params.amount) ||
                    _.isEmpty(params.account_name) ||
                    _.isEmpty(params.account_no) ||
                    _.isEmpty(params.bank_name) ||
                    _.isEmpty(params.ifsc_code)
                ) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');
    
                    return res.status(200).json(Service.response(0, localization.missingParamError, null));
                }


                if (params.amount < config.bank_min_withdraw_limit) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                    return res.status(200).json(Service.response(0, localization.minWithdrawalLimit+config.bank_min_withdraw_limit, null));
                }

            }

            if (params.payment_type == 'phonepe') {
                if (_.isEmpty(params.amount)) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                    return res.status(200).json(Service.response(0, localization.missingParamError, null));
                }

                if (params.mobile_no != '') {
                    // USE MOBILE NO
                } else if (params.upi_id != '') {
                    // USE UPI ID
                } else {
                    //ERROR
                    return res.status(200).json(Service.response(0, localization.missingParamError, null));
                }

                const us = await User.findById(req.user._id);

                if (!us) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                    return res.status(200).json(Service.response(0, localization.ServerError, null));
                }

                if (params.amount < 50) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                    return res.status(200).json(Service.response(0, localization.minWithdrawalLimit, null));
                }

                if (us.win_wallet < params.amount) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                    return res.status(200).json(Service.response(0, localization.insufficientWithdrawlError, null));
                }

                if (!us.otp_verified) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                    return res.status(200).json(Service.response(0, localization.accountVerifiedError, null));
                }

                const wq = new WithdrawalRequest({
                    user_id: us._id,
                    amount: params.amount,
                    payment_type: params.payment_type,
                    mobile_no: params.mobile_no,
                    upi_id: params.upi_id,
                    created_at: new Date().getTime()
                });

                us.win_wallet = us.win_wallet - params.amount;
                var t = await us.save();
                // if (t) {
                //     logger.info("amount deducted", us.win_wallet);
                // }
                const rez = await wq.save();

                if (!rez) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                    return res.status(200).json(Service.response(0, localization.ServerError, null));
                }
                var endTime = new Date();
                utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                return res.status(200).json(Service.response(1, localization.success, null));
            }

            if (params.payment_type == 'google_pay') {
                if (_.isEmpty(params.amount)) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                    return res.status(200).json(Service.response(0, localization.missingParamError, null));
                }

                if (params.mobile_no != '') {
                    // USE MOBILE NO
                } else if (params.upi_id != '') {
                    // USE UPI ID
                } else {
                    //ERROR
                    return res.status(200).json(Service.response(0, localization.missingParamError, null));
                }

                const us = await User.findById(req.user._id);

                if (!us) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                    return res.status(200).json(Service.response(0, localization.ServerError, null));
                }

                if (params.amount < 50) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                    return res.status(200).json(Service.response(0, localization.minWithdrawalLimit, null));
                }

                if (us.win_wallet < params.amount) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                    return res.status(200).json(Service.response(0, localization.insufficientWithdrawlError, null));
                }

                if (!us.otp_verified) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                    return res.status(200).json(Service.response(0, localization.accountVerifiedError, null));
                }

                const wq = new WithdrawalRequest({
                    user_id: us._id,
                    amount: params.amount,
                    payment_type: params.payment_type,
                    mobile_no: params.mobile_no,
                    upi_id: params.upi_id,
                    created_at: new Date().getTime()
                });

                us.win_wallet = us.win_wallet - params.amount;
                var t = await us.save();
                // if (t) {
                //     logger.info("amount deducted", us.win_wallet);
                // }
                const rez = await wq.save();

                if (!rez) {
                    var endTime = new Date();
                    utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                    return res.status(200).json(Service.response(0, localization.ServerError, null));
                }
                var endTime = new Date();
                utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                return res.status(200).json(Service.response(1, localization.success, null));
            }

            // if (params.amount < 50) {
            //     var endTime = new Date();
            //     utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

            //     return res.status(200).json(Service.response(0, localization.minWithdrawalLimit, null));
            // }

            if (req.user.win_wallet < params.amount) {
                var endTime = new Date();
                utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                return res.status(200).json(Service.response(0, localization.insufficientWithdrawlError, null));
            }

            if (!req.user.otp_verified) {
                var endTime = new Date();
                utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                return res.status(200).json(Service.response(0, localization.accountVerifiedError, null));
            }

            const weq = new WithdrawalRequest({
                user_id: req.user._id,
                amount: params.amount,
                account_name: params.account_name,
                account_no: params.account_no,
                bank_name: params.bank_name,
                ifsc_code: params.ifsc_code,
                payment_type: params.payment_type,
                mobile_no: req.user.mobile_no.number,
                upi_id: req.user.upi_id,
                created_at: new Date().getTime()
            });

            //logger.info('With Request :: ', weq);

            req.user.win_wallet = req.user.win_wallet - params.amount;
            var t = await req.user.save();
            // if (t) {
            //     logger.info("amount deducted", req.user.win_wallet);
            // }

            const result = await weq.save();

            if (!result) {
                var endTime = new Date();
                utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            var endTime = new Date();
            utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

            res.status(200).json(Service.response(1, localization.success, null));
        } catch (err) {
            var endTime = new Date();
            utility.logElapsedTime(req, startTime, endTime, 'withdrawRequest');

            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    // for cache implementation
    gameRecords: async function(req, res) {
        var startTime = new Date();

        //logger.info("Game Records Request >> ", req.body);

        userHistory = await Table.aggregate([
            {
                $match: {
                    'players.id': req.user._id
                }
            },
            {
                $unwind: '$players'
            },
            {
                $match: {
                    'players.id': req.user._id
                }
            },
            {
                $project: {
                    room: 1,
                    fees: '$players.fees',
                    pl: {
                        $cond: [
                            { $gt: ['$players.pl', 0] },
                            { $subtract: ['$players.pl', '$players.fees'] },
                            '$players.pl'
                        ]
                    },
                    created_at: 1
                }
            },{
                $match:{
                    'pl':{$ne:0}
                }
            }
        ]);

        // userHistory = userHistory.filter(d => d.players[0].fees != 0);
        // userHistory = userHistory.map(d => {
        //     return {
        //         room: d.room,
        //         fees: d.players[0].fees,
        //         pl: d.players[0].pl,
        //         created_at: d.created_at || 0
        //     };
        // });

        var endTime = new Date();
        utility.logElapsedTime(req, startTime, endTime, 'gameRecords');

        return res.status(200).json(Service.response(1, localization.TransactionsHistory, userHistory));
    },

    withdrawHistory: async (req, res) => {
        var startTime = new Date();

        try {
            //logger.info("Withdrawal History Request >> ", req.body);

            var withdrawalHistory = await WithdrawalRequest.find({
                user_id: req.user._id
            });

            withdrawalHistory = withdrawalHistory.map(d => {
                return {
                    mode: d.payment_type,
                    amount: d.amount,
                    status: d.is_status,
                    created_at: d.created_at || 0
                };
            });
            var endTime = new Date();
            utility.logElapsedTime(req, startTime, endTime, 'withdrawHistory');

            return res.status(200).json(Service.response(1, localization.TransactionsHistory, withdrawalHistory));
        } catch (err) {
            var endTime = new Date();
            utility.logElapsedTime(req, startTime, endTime, 'withdrawHistory');

            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    listAllAjaxGameRecode: async (req, res) => {
        var startTime = new Date();

        try {
            const params = req.query;
            logger.info('QUERY', params);
            logger.info(params.start);

            let matchObj = {
                players: {
                    $ne: []
                }
            };

            const user_id = params.id || '';

            if (Service.validateObjectId(user_id)) {
                matchObj['players.id'] = ObjectId(user_id);
            }

            if (params.search.value.trim() != '') {
                matchObj.room = {
                    $regex: params.search.value,
                    $options: 'i'
                };
            }

            let agg = [
                {
                    $match: matchObj
                }
            ];

            agg.push(
                {
                    $sort: {
                        created_at: -1
                    }
                },
                {
                    $skip: params.start == 'All' ? 0 : parseInt(params.start)
                }
            );

            if (params.length != -1) {
                agg.push({
                    $limit: parseInt(params.length)
                });
            }

            agg.push(
                {
                    $unwind: '$players'
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'players.id',
                        foreignField: '_id',
                        as: 'users'
                    }
                },
                {
                    $unwind: '$users'
                }
            );

            agg.push({
                $group: {
                    _id: '$_id',
                    room: {
                        $first: '$room'
                    },
                    room_type: {
                        $first: '$room_type'
                    },
                    no_of_players: {
                        $first: '$no_of_players'
                    },
                    created_by: {
                        $first: '$created_by'
                    },
                    game_started_at: {
                        $first: '$game_started_at'
                    },
                    game_completed_at: {
                        $first: '$game_completed_at'
                    },
                    created_date: {
                        $first: '$created_date'
                    },
                    created_at: {
                        $first: '$created_at'
                    },
                    room_fee: {
                        $first: '$room_fee'
                    },
                    players: {
                        $push: {
                            id: '$players.id',
                            rank: '$players.rank',
                            pl: '$players.pl',
                            username: '$users.username'
                        }
                    }
                }
            });

            agg.push({
                $project: {
                    _id: 1,
                    room: 1,
                    room_type: 1,
                    no_of_players: 1,
                    created_by: 1,
                    created_at: 1,
                    game_started_at: 1,
                    game_completed_at: 1,
                    created_date: 1,
                    room_fee: 1,
                    players: 1,
                    data: 1
                }
            });

            logger.info('AGGR', agg);

            const llist = await Table.aggregate(agg).option({
                allowDiskUse: true
            });

            var gData = await Promise.all(
                llist.map(async u => {
                    let datatoRender = '';

                    if (u.players.length > 0) {
                        for (let ij = 0; ij < u.players.length; ij++) {
                            datatoRender += `<tr>
                        <td><a href="/user/view/${u.players[ij].id}">${u.players[ij].username}</a></td>
                        <td>${u.players[ij].rank}</td>
                        <td>${u.players[ij].pl}</td>
                        </tr>`;
                        }
                    }

                    return [
                        u.room,
                        `<span class="label label-${u.room_type == 'PUB' ? 'success' : 'info'}">${
                            u.room_type == 'PUB' ? 'Public' : 'Private'
                        }</span>`,
                        u.no_of_players,
                        u.room_fee,
                        `<div class="time_formateDateandTime2">${u.created_at}</div>`,
                        `<table class="table">
                        <tr class="success">
                            <th>User</th>
                            <th>Rank</th>
                            <th>PL</th>
                        </tr>
                        ${datatoRender}
                    </table>`
                    ];
                })
            );

            let total = await Table.find({
                players: {
                    $ne: []
                }
            }).countDocuments();
            let total_f = await Table.find(matchObj).countDocuments();

            // logger.info('Final Returned Data :: ',gData);
            // logger.info("LLIST", llist);
            var endTime = new Date();
            utility.logElapsedTime(req, startTime, endTime, 'listAllAjaxGameRecode');

            return res.status(200).send({
                data: gData,
                draw: new Date().getTime(),
                recordsTotal: total,
                recordsFiltered: total_f
            });
        } catch (err) {
            logger.info('ERR', err);
        }
    }
};
