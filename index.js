var sensor = require('node-dht-sensor');
var Lcd = require('lcd');

lcd = new Lcd({rs: 13, e: 19, data: [16, 20, 21, 26], cols: 16, rows: 2});

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

process.on('SIGINT', function () {
	lcd.close();
	process.exit();
});

lcd.on('ready', function() {
	setInterval(function () {
		sensor.read(22, 17, function(err, temperature, humidity) {
			if (!err) {
				var temp = (temperature * 1.8 + 32).toFixed(1);
				var hum  = humidity.toFixed(1);
				var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

				printRow(date, 0, function() {
					printRow(temp + 'F - ' + hum + '%', 1);
				});
			}
		});
	}, 100000 );
});
