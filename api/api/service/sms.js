var {
	User
} = require('../models/user');
var config = require('../../config');
var request = require('request');
var apikey = config.textLocalKey.apikey;
var senderID = config.textLocalKey.sender;

const accountSid = config.twilioAccountKey.accountSid;
const authToken = config.twilioAccountKey.authToken;
var sender = config.twilioAccountKey.sender;



var logger = require('./logger');

module.exports = {

	sendOtpold: function (mobile, otp) {
		console.log("FUNCTION CALLED", mobile, otp);
		return new Promise((resolve, reject) => {
			var projectname = config.project_name;
			var message = otp + ' is your OTP (One Time Password) to verify your user account on ' + projectname;

			request.post('https://api.textlocal.in/send/', {
				form: {
					apikey: apikey,
					numbers: mobile,
					message: message,
					sender: senderID
				}
			}, function (error, response, body) {
				console.log("FUNCTION RES", JSON.parse(body), apikey);

				if (response.statusCode == 200) {
					//logger.info('Response:', body);

					try {
						var body_obj = JSON.parse(body);
						if (body_obj.status == 'success') {
							//logger.info("OTP Sent!");
							return resolve(true);
						} else {
							return resolve(false);
						}
					} catch (e) {
						console.log("ERROR PARSING SMS", e, body);
						return resolve(false);
					}

				} else {
					//logger.info("Server Error", body);
					return resolve(false);
				}
			});
		});
	},

	sendOtp: function (mobile, otp) {

		console.log("FUNCTION CALLED", mobile, otp);
		return new Promise((resolve, reject) => {

			var projectname = config.project_name;
			var message = otp + ' is your OTP (One Time Password) to verify your user account on ' + projectname;
			
			const accountSid = config.twilioAccountKey.accountSid;
			const authToken = config.twilioAccountKey.authToken;
			var sender = config.twilioAccountKey.sender;
			
			const client = require('twilio')(accountSid, authToken);
			client.messages
				.create({
					body: message,
					from: sender,
					to: mobile
				})
				.then(message => {
					console.log(message);
					if(message.status=="sent" || message.status=="queued"){
						return resolve(true);
					}else{
						return resolve(false);
					}
			});
		
		});
	},

	sendResetPasswordLinkold: function (mobile, urllink) {
		console.log("FUNCTION CALLED", mobile, urllink);
		return new Promise((resolve, reject) => {
			var projectname = config.project_name;
			var message = urllink + ' is your Reset password link to set new password for your account on ' + projectname;

			request.post('https://api.textlocal.in/send/', {
				form: {
					apikey: apikey,
					numbers: mobile,
					message: message,
					sender: senderID
				}
			}, function (error, response, body) {
				console.log("FUNCTION RES", JSON.parse(body), apikey);

				if (response.statusCode == 200) {
					//logger.info('Response:', body);

					try {
						var body_obj = JSON.parse(body);
						if (body_obj.status == 'success') {
							//logger.info("OTP Sent!");
							return resolve(true);
						} else {
							return resolve(false);
						}
					} catch (e) {
						console.log("ERROR PARSING SMS", e, body);
						return resolve(false);
					}

				} else {
					//logger.info("Server Error", body);
					return resolve(false);
				}
			});
		});
	},

	sendResetPasswordLink: function (mobile, urllink) {
		
		// console.log("FUNCTION CALLED", mobile, urllink);
		return new Promise((resolve, reject) => {
			
			var projectname = config.project_name;
			var message = urllink + ' is your Reset password link to set new password for your account on ' + projectname;
			
			const accountSid = config.twilioAccountKey.accountSid;
			const authToken = config.twilioAccountKey.authToken;
			var sender = config.twilioAccountKey.sender;
			
			const client = require('twilio')(accountSid, authToken);
			client.messages
				.create({
					body: message,
					from: sender,
					to: mobile
				})
				.then(message => {
					console.log(message);
					if(message.status=="sent" || message.status=="queued"){
						return resolve(true);
					}else{
						return resolve(false);
					}
				});
		});
	},

	sendTest: function (mobile) {

		console.log("FUNCTION CALLED", mobile);
		return new Promise((resolve, reject) => {

			var projectname = config.project_name;
			var message = 'is your OTP (One Time Password) to verify your user account on ' + projectname;
			
			const accountSid = config.twilioAccountKey.accountSid;
			const authToken = config.twilioAccountKey.authToken;
			var sender = config.twilioAccountKey.sender;
			
			const client = require('twilio')(accountSid, authToken);
			client.messages
				.create({
					body: message,
					from: sender,
					to: mobile
				})
				.then(message => {
					console.log(message);
					if(message.status=="sent" || message.status=="queued"){
						return resolve(true);
					}else{
						return resolve(false);
					}
			});
		
		});
	},
}