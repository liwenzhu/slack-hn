var request = require('request');
var async = require('async');
var gbk = require('gbk');

var WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || 'https://hooks.slack.com/services/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';

function checkStock(stock, cb) {
	request.get({url:'http://hq.sinajs.cn/list=' + stock, encoding: null}, function(err, res, body) {
		if (err) {
			return cb(err);
		}

		var result = gbk.toString('utf-8', body);
		result = result.split('=');
		result = result[1].split(',');
		var name = result[0].substring(1);
		var currentPrice = result[3];
		console.log('result:', result);
		result = '股票: ' + name + '\n';
		result += '当前价格: ' + currentPrice + '\n';
		result += '卖五:' + result[29] + ',' + result[28] + '\n';
		result += '卖四:' + result[27] + ',' + result[26] + '\n';
		result += '卖三:' + result[25] + ',' + result[24] + '\n';
		result += '卖二:' + result[23] + ',' + result[22] + '\n';
		result += '卖一:' + result[21] + ',' + result[20] + '\n';
		result += '买一:' + result[11] + ',' + result[10] + '\n';
		result += '买二:' + result[13] + ',' + result[12] + '\n';
		result += '买三:' + result[15] + ',' + result[14] + '\n';
		result += '买四:' + result[17] + ',' + result[16] + '\n';
		result += '买五:' + result[19] + ',' + result[18] + '\n';
		result += '++++++++++++++++++++\n';
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
