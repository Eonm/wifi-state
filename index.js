const spawn = require('child_process').spawn
const execSync = require('child_process').execSync
const EventEmitter = require('events').EventEmitter
const iwevent = spawn('iwevent')

const macAdressMatcher = /(([A-Z0-9]{2}:)){5}[A-Z0-9]{2}/

module.exports = new EventEmitter()

function getCurrentNetworkInfo() {
	try {
		let accessPointInfo = execSync('iwgetid -a').toString()

		return {
			frequency : execSync('iwgetid -f').toString().match(/Frequency:(.+?)GHz/)[1],
			protocol 	: execSync('iwgetid -p').toString().match(/Protocol Name:"(.+?)"/)[1],
			chanel 		: execSync('iwgetid -c').toString().match(/Channel:(.+?)\b/)[1],
			bssid 		: accessPointInfo.match(macAdressMatcher)[0],
			essid 		: execSync('iwgetid -r').toString().trim(),
			iface 		: accessPointInfo.match(/^\b.+?\b/)[0],
			mode 			: execSync('iwgetid -m').toString().match(/Mode:(.+)\b/)[1]
		}
	} catch (e) {
		throw 'Cannot retrieve network informations'
	}
}

setTimeout(function () {
	try {
		module.exports.emit('connected', getCurrentNetworkInfo())
	} catch (e) {
		module.exports.emit('disconnected', 'Not connected')
	}
}, 300)

iwevent.stdout.on('data', function(wifiState) {
	let cleanedwifiState = wifiState.toString().trim()

	if (cleanedwifiState.match('Not-Associated')) {
		return module.exports.emit('disconnected', 'Not connected')
	}

	if (cleanedwifiState.match('New Access Point/Cell address:')) {
		setTimeout(function () {
			return module.exports.emit('connected', getCurrentNetworkInfo())
		}, 700)
	}
})
