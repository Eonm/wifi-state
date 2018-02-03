Get wifi state on real time (connected/disconnected). While  you are connected to a wireless network _wifi-state_ will returns the current acces point informations (essid, bssid, protocol, chanel, network interface, mode). _Wifi-states_ will update access point information in real time each time you connect or disconnect from a wireless access point.

## Install

```
$ npm install wifi-state
```

## Usages

 ```js
const wifiState = require('wifi-state')

wifiState.start() // start listening for network informations

wifiState.on('connected', function(networkInfo) { // get live updates of network informations
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

wifiState.on('disconnected', function(networkInfo) { // get live updates of network informations
// networkInfo : 'Not connected'
console.log(networkInfo)
})

wifiState.stop() // Stop wifi-state listener, otherwise it will listening for new network informations for ever.

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
 * This script requires iwevent to be installed (already installed on most linux distributions).
 * This scipt only have been tesed with one wireless card.
