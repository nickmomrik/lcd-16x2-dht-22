var sensor = require('node-dht-sensor');
var Lcd = require('lcd');
var moment = require('moment');

lcd = new Lcd({
	rs: 13,
	e: 19,
	data: [16, 20, 21, 26],
	cols: 16,
	rows: 2
});

function printRow(string, row, cb) {
	lcd.setCursor(0, row);
	lcd.print(string, function (err) {
		if (err) {
			throw err;
		}

		if (cb) {
			cb();
		}
	});
}

function doSensorRead() {
	sensor.read(22, 17, function(err, temperature, humidity) {
		if (!err) {
			var date = moment().format(' MMM D   hh:mm');
			var info = ' ' + (temperature * 1.8 + 32).toFixed(1) + String.fromCharCode(223) + 'F   ' + humidity.toFixed(1) + '%';

			console.log(date, info);
			printRow(date, 0, function() {
				printRow(info, 1);
			});
		}
	});
}

lcd.on('ready', function() {
	doSensorRead();

	setInterval(doSensorRead, 10000);
});
