import SafeEventEmitter from 'safe-event-emitter'
import { Proxy } from 'lib/messaging'

class ProxyProvider extends SafeEventEmitter {
  constructor (host, timeout) {
    super();

    this.host    = 'popwallet';
    this.timeout = timeout || 0;
    this.proxy   = new Proxy('ETH_TX', 'ETH_RX');
  }

  sendAsync (payload, callback) { this.proxy.send(payload, callback); }
}

export default ProxyProvider;
