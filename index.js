const spawn = require('child_process').spawn
const execSync = require('child_process').execSync
const EventEmitter = require('events').EventEmitter
const iwevent = spawn('iwevent')

const macAdressMatcher = /(([A-Z0-9]{2}:)){5}[A-Z0-9]{2}/

module.exports = new EventEmitter()

function currentEssid () {
	try {
		return execSync('iwgetid -r').toString().trim()
	} catch (e) {
		throw 'Can\'t get current essid'
	}
}

setTimeout(function () {
	try {
		let bssid = execSync('iwgetid -a').toString().match(macAdressMatcher)[0]
		module.exports.emit('connected', {essid: currentEssid(), 'bssid': bssid})
	} catch (e) {
		module.exports.emit('disconnected', 'Not connected')
	}
}, 300)

iwevent.stdout.on('data', function(wifiStatus) {
	let cleanedwifiStatus = wifiStatus.toString().trim()

	if (cleanedwifiStatus.match('Not-Associated')) {
		return module.exports.emit('disconnected', 'Not connected')
	}

	if (cleanedwifiStatus.match('New Access Point/Cell address:')) {
		let bssid = cleanedwifiStatus.match(macAdressMatcher)[0]
		setTimeout(function () {
			let essid = currentEssid ()
			return module.exports.emit('connected', {'essid': essid, 'bssid': bssid})
		}, 700)
	}
})
