const spawn = require('child_process').spawn
const execSync = require('child_process').execSync
const EventEmitter = require('events').EventEmitter
let iwevent

const macAdressMatcher = /(([A-Z0-9]{2}:)){5}[A-Z0-9]{2}/

module.exports = new EventEmitter()

let getCurrentNetworkInfo = () => {
  try {
    let accessPointInfo = execSync('iwgetid -a').toString()
    return {
      frequency : execSync('iwgetid -f').toString().match(/Frequency:(.+?)GHz/)[1],
      protocol  : execSync('iwgetid -p').toString().match(/Protocol Name:"(.+?)"/)[1],
      chanel    : execSync('iwgetid -c').toString().match(/Channel:(.+?)\b/)[1],
      bssid     : accessPointInfo.match(macAdressMatcher)[0],
      essid     : execSync('iwgetid -r').toString().trim(),
      iface     : accessPointInfo.match(/^\b.+?\b/)[0],
      mode      : execSync('iwgetid -m').toString().match(/Mode:(.+)\b/)[1]
    }
  } catch (e) {}
}

module.exports.networkInfo = () => (multipleTry(getCurrentNetworkInfo,7))

module.exports.start = () => {
  iwevent = spawn('iwevent')
    multipleTry(getCurrentNetworkInfo,20)
    .then(networkInfo => module.exports.emit('connected', networkInfo))
    .catch(err => module.exports.emit('disconnected', 'Not connected'))

  iwevent.stdout.on('data', function(wifiState) {
    let cleanedwifiState = wifiState.toString().trim()

    if (cleanedwifiState.match('Not-Associated')) {
      return module.exports.emit('disconnected', 'Not connected')
    }

    if (cleanedwifiState.match('New Access Point/Cell address:')) {
      multipleTry(getCurrentNetworkInfo,100)
      .then(networkInfo => module.exports.emit('connected', networkInfo))
    }
  })
}

module.exports.stop = StopWifiState = () => {
  try {
    iwevent.kill()
  } catch (e) {
    throw 'Cannot stop unstarted process'
  }
}

function multipleTry(cb,maxAttempts) {
  return new Promise(function(resolve, reject) {
    if (cb()) return resolve(cb())
    let interval = setInterval(function () {
      if (cb()) {
        clearInterval(interval)
        resolve(cb())
      }
      maxAttempts --
      if (maxAttempts === 0) {
        clearInterval(interval)
        reject('Cannot retrieve network information')
      }
    }, 100);
  })
}
