import SafeEventEmitter from 'safe-event-emitter'
import { RpcProxy }     from 'lib/rpc'

export class EthereumProvider extends SafeEventEmitter {
  constructor (host, timeout) {
    super(host, timeout);

    this.host    = 'poplocker';
    this.timeout = timeout || 0;
    this.proxy   = new RpcProxy('ETH_TX', 'ETH_RX');
    this.id      = 0;
    this.jsonrpc = '2.0';
  }

  // legacy 1102 implementation
  enable () {
    return this.send('eth_requestAccounts');
  }

  send (method, params = []) {
    if (!method || typeof method !== 'string')
      return new Error('Method is not a valid string.');

    if (!(params instanceof Array))
      return new Error('Params is not a valid array.');

    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.proxy.send({ method, params, id, jsonrpc: this.jsonrpc }, (error, data) => {
        if (data && data.error) {
          reject(data.error);
        }
        else if (error)
          reject(error);
        else
          resolve(data && data.result);
      })
    })
  }
}

export class Web3Provider extends EthereumProvider {
  constructor (host, timeout) {
    super(host, timeout);
  }

  sendAsync (payload, callback) { this.proxy.send(payload, callback); }
}
