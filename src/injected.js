import ProxyProvider from 'lib/proxy_provider'
import { RpcProxy } from 'lib/rpc'

if (typeof window.web3 !== 'undefined') {
  throw(new Error('Another web3 instance in use!'));
}
else {
  window.web3 = { currentProvider: new ProxyProvider() };
}

// TODO: DRY it
window.popLockerProxy = new RpcProxy('POPLOCKER_API', 'POPLOCKER_TX', 'POPLOCKER_RX');
window.popLockerMessageId = 1;
window.popLocker = {
  getDeviceAddress : callback => {
    popLockerProxy.send(
      {
        method: 'getDeviceAddress',
        id: popLockerMessageId++
      },
      (proxy, response) => {
        if (callback) callback(response.result);
      }
    )
  },
  getSmartLockerAddress : callback => {
    popLockerProxy.send(
      {
        method: 'getSmartLockerAddress',
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
