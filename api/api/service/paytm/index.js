var request = require('request');
const config = require('./../../../config');
const _ = require('lodash');

module.exports = {
    verify_transaction: function(order_id, checksum) {
        return new Promise((resolve, reject) => {
            console.log(order_id,checksum);
            var options = {
                method: 'POST',
                url: `${config.PAYTM.URL}${config.PAYTM.CHECK_TRANSACTION_STATUS}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    MID: config.PAYTM.MID,
                    ORDERID: order_id,
                    CHECKSUMHASH: checksum
                },
                json: true
            };

            request(options, function(error, response, body) {
                if (error) {
                    console.log('Verification check failed', error);
                    return reject('Verification check failed, please try again!');
                }
                console.log('BODY', body);
                return resolve(body);
            });
        });
    }
};
