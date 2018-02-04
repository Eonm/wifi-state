Get wifi state on real time (connected/disconnected) with ___wifi-state___. While  you are connected to a wireless network _wifi-state_ will returns the current acces point information (essid, bssid, protocol, chanel, network interface, mode). _Wifi-states_ will update access point information in real time each time you're connecting or disconnecting from a wireless access point. You can also fetch manually network information.

## Install

```
$ npm install wifi-state --save
```

## Usages

 ```js
const wifiState = require('wifi-state')

wifiState.start() // start listening for network information

wifiState.on('connected', function(networkInfo) { // get live updates of network information
console.log(networkInfo)
/*
  { frequency: '5.18 ',
    protocol: 'IEEE 802.11',
    chanel: '36',
    bssid: 'FF:FF:FF:FF:FF:FF',
    essid: 'networkName',
    iface: 'wlp7s0',
    mode: 'Managed' }
*/
})

wifiState.on('disconnected', function(networkInfo) { // get live updates of network information
console.log(networkInfo)
// 'Not connected'
})

wifiState.stop() // Stop wifi-state listener, otherwise it will listening for new network information for ever.

wifiState.networkInfo() // get manualy network information
  .then(networkInfo => console.log(networkInfo))
  .catch((err) => {console.log(err)})
```
* ``wifiState.on('XXXX', function() {})`` needs ``wifiState.start()`` of having being declared.
* ``wifiState.networkInfo()`` works without ``wifiState.start()``.
* ``wifiState.networkInfo()`` return a promise.

 __Notes :__
 * This script only works on linux.
 * This script requires iwevent to be installed (already installed on most linux distributions).
 * This script only have been tested with one wireless card.

__Changelog :__
* ``wifiState.networkInfo()`` now returns a promise.
* Before failing, _wifi-state_ will tries to get network information  multiple times (_e.g._ if the connection to the access point takes a long time to be established).
