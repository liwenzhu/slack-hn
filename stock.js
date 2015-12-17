var request = require('request');
var async = require('async');
var gbk = require('gbk');

var WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || 'https://hooks.slack.com/services/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';

function checkStock(stock, cb) {
	request.get({url:'http://hq.sinajs.cn/list=' + stock, encoding: null}, function(err, res, body) {
		if (err) {
			return cb(err);
		}

		body = gbk.toString('utf-8', body);
		body = body.split('=');
		body = body[1].split(',');
		var name = body[0].substring(1);
		var currentPrice = body[3];
		console.log('result:', result);
		var result = '股票: ' + name + '\n';
		result += '当前价格: ' + currentPrice + '\n';
		result += '卖五:' + body[29] + ',' + body[28] + '\n';
		result += '卖四:' + body[27] + ',' + body[26] + '\n';
		result += '卖三:' + body[25] + ',' + body[24] + '\n';
		result += '卖二:' + body[23] + ',' + body[22] + '\n';
		result += '卖一:' + body[21] + ',' + body[20] + '\n';
		result += '买一:' + body[11] + ',' + body[10] + '\n';
		result += '买二:' + body[13] + ',' + body[12] + '\n';
		result += '买三:' + body[15] + ',' + body[14] + '\n';
		result += '买四:' + body[17] + ',' + body[16] + '\n';
		result += '买五:' + body[19] + ',' + body[18] + '\n';
		result += '++++++++++++++++++++\n';
		console.log('before return :', result);
		return cb(null, result);
	});
};
function stock (req, res, next) {
	var stocks = ['sz002402', 'sh600173'];

	var botPayload = '当前股票价格:\n';
	async.forEach(stocks, function(stock, cb) {
		checkStock(stock, function(err, result){
			if (err) {
				return cb(err);
			}
			botPayload += result;
			return cb();
		});
	}, function(err) {
		var payload = {
			text: botPayload,
			username: 'StockRob'
		};

		// console.log(JSON.stringify(payload));
		// return res.status(200).end();
		request.post({
			url: WEBHOOK_URL,
			body: JSON.stringify(payload)
		}, function(err){
			if (err) {
				return res.status(500).end();
			}
			return res.status(200).end();
		});
	});
}

module.exports = stock;
