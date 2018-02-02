Get wifi-state on real time (connected/disconnected). While connected wifi-status returns the current acces point informations (essid, bssid, protocol, chanel, network interface, mode).

## Install

```
$ npm install wifi-states
```

## Usages

 ```js
const wifiState = require('wifi-state')

wifiState.start() // start listening network information for live updates

wifiState.on('connected', function(networkInfo) {
/* networkInfo : { frequency: '5.18 ',
protocol: 'IEEE 802.11',
chanel: '36',
bssid: 'FF:FF:FF:FF:FF:FF',
essid: 'networkName',
iface: 'wlp7s0',
mode: 'Managed' }
*/
console.log(networkInfo.essid)
console.log(networkInfo.bssid)
})

wifiState.on('disconnected', function(networkInfo) {
// networkInfo : 'Not connected'
})

wifiState.stop() // Otherwise the script will listening for ever for new network informations

wifiState.networkInfo() /* => { frequency: '5.18',
															protocol: 'IEEE 802.11',
															chanel: '36',
															bssid: 'FF:FF:FF:FF:FF:FF',
															essid: 'networkName',
															iface: 'wlp7s0',
															mode: 'Managed' }
															*/
```
* ``wifiState.on('XXXX', function() {})`` needs ``wifiState.start()`` of having being declared.
* ``wifiState.networkInfo()`` works without ``wifiState.start()``

 __Notes :__
 * This script only works on linux.
 * This script requires iwevent to be installed (installed in most linux distributions).
 * This scipt only have been tesed with one wireless card.
