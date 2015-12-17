var request = require('request');
var async = require('async');
var gbk = require('gbk');

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
		// result += '买一:' + result[3] + '\n';
		// result += '买一:' + result[3] + '\n';
		// result += '买一:' + result[3] + '\n';
		// result += '买一:' + result[3] + '\n';
		// result += '买一:' + result[3] + '\n';
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

		console.log(JSON.stringify(payload));
		return res.status(200).end();
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
