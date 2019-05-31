import SafeEventEmitter from 'safe-event-emitter'
import { RpcProxy }     from 'lib/rpc'

export class Web3Provider extends SafeEventEmitter {
  constructor (host, timeout) {
    super();

    this.host    = 'poplocker';
    this.timeout = timeout || 0;
    this.proxy   = new RpcProxy('ETH_TX', 'ETH_RX');
  }

  sendAsync (payload, callback) { this.proxy.send(payload, callback); }
}

export class EthereumProvider extends Web3Provider {
  constructor (host, timeout) {
    super();

    this.host    = 'poplocker';
    this.timeout = timeout || 0;
    this.proxy   = new RpcProxy('ETH_TX', 'ETH_RX');
    this.id      = 0;
    this.jsonrpc = '2.0';
  }

  send (method, params = []) {
    if (!method || typeof method !== 'string')
      return new Error('Method is not a valid string.');

    if (!(params instanceof Array))
      return new Error('Params is not a valid array.');

    return new Promise((resolve, reject) => {
      this.id = this.id + 1;
      this.proxy.send({ method, params, id: this.id, jsonrpc: this.jsonrpc }, (err, data, resp) => {
        err ? reject(err) : resolve(data && data.result);
      })
    });
  }
}
