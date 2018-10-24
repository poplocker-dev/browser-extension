import SafeEventEmitter from 'safe-event-emitter'

class ProxyProvider extends SafeEventEmitter {
  constructor(host, timeout) {
    super();

    this.host    = 'popwallet';
    this.timeout = timeout || 0;
  }

  send(payload, callback) {
    console.log('sent', payload);
  }
}

export default ProxyProvider;
