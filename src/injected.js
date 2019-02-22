import ProxyProvider from 'lib/proxy_provider'
import { PopLockerApiProxy } from 'lib/rpc'

if (typeof window.web3 !== 'undefined') {
  throw(new Error('Another web3 instance in use!'));
}
else {
  window.web3 = { currentProvider: new ProxyProvider() };
}

window.popLockerApiProxy = new PopLockerApiProxy('POPLOCKER_TX', 'POPLOCKER_RX');
window.popLockerApiMessageId = 1;
window.poplocker = {
  getSmartLockerState : () => {
    popLockerApiProxy.send(
      {
        method: 'getSmartLockerState',
        id: popLockerApiMessageId++
      },
      (proxy, response) => {alert(response.result)}
     );
  },
  setSmartLockerAddress : address => {
    popLockerApiProxy.send(
      {
        method: 'setSmartLockerAddress',
        address: address,
        id: popLockerApiMessageId++
      },
      (proxy, response) => {alert(response.result)}
     );
  }
}
