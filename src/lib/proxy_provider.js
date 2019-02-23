import SafeEventEmitter from 'safe-event-emitter'
import { MessagingProxy }     from 'lib/rpc'

class ProxyProvider extends SafeEventEmitter {
  constructor (host, timeout) {
    super();

    this.host    = 'poplocker';
    this.timeout = timeout || 0;
    this.proxy   = new MessagingProxy('ETH_RPC', 'ETH_TX', 'ETH_RX');
  }

  sendAsync (payload, callback) { this.proxy.send(payload, callback); }
}

export default ProxyProvider;
