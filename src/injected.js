import ProxyProvider from 'lib/proxy_provider'
import { MessagingProxy } from 'lib/rpc'

if (typeof window.web3 !== 'undefined') {
  throw(new Error('Another web3 instance in use!'));
}
else {
  window.web3 = { currentProvider: new ProxyProvider() };
}

window.popLockerProxy = new MessagingProxy('POPLOCKER_API', 'POPLOCKER_TX', 'POPLOCKER_RX');
window.popLockerMessageId = 1;
window.poplocker = {
  getSmartLockerState : callback => {
    popLockerProxy.send(
      {
        method: 'getSmartLockerState',
        id: popLockerMessageId++
      },
      (proxy, response) => {
        if (callback) callback(response.result);
      }
    )
  },
  setSmartLockerAddress : (address, callback) => {
    popLockerProxy.send(
      {
        method: 'setSmartLockerAddress',
        address: address,
        id: popLockerMessageId++
      },
      (proxy, response) => {
        if (callback) callback(response.result);
      }
    )
  }
}
