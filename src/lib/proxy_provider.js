import SafeEventEmitter from 'safe-event-emitter'
import { RpcProxy }     from 'lib/rpc'

export class Web3Provider extends SafeEventEmitter {
  constructor (host, timeout) {
    super();

    this.host    = 'poplocker';
    this.timeout = timeout || 0;
    this.proxy   = new RpcProxy('ETH_RPC', 'ETH_TX', 'ETH_RX');
  }

  sendAsync (payload, callback) { this.proxy.send(payload, callback); }
}

export class PopLockerProvider {
  constructor () {
    this.counter = 1;
    this.proxy = new RpcProxy('POPLOCKER_API', 'POPLOCKER_TX', 'POPLOCKER_RX');
  }

  sendAsync (payload) {
    this.counter++;
    return new Promise((resolve, reject) => {
      this.proxy.send({ ...payload, id: this.counter }, (err, response) => {
        if (!err) resolve(response.result);
        else reject(err);
      });
    });
  }

  getSmartLockerState () {
    return this.sendAsync({ method: 'getSmartLockerState' })
  }

  setSmartLockerAddress (address) {
    return this.sendAsync({
      method: 'setSmartLockerAddress',
      address: address,
    });
  }
}
