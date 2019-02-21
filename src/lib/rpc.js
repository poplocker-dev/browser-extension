import { account } from 'lib/storage'

// poke background.js to do
// something funny
export const delegateTo = {
  send: (msg, port) => {
    let message = {...msg, port};

    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError || !response) {
          reject(chrome.runtime.lastError);
        }
        else resolve(response);
      });
    });
  },

  background: function(message) {
    return this.send(message, 'background');
  }
}

// calls background.js through
// proxy. Used by contentscript.js
// that lives in separate DOM
export class RpcProxy {
  constructor (up, down) {
    this.up       = up;
    this.down     = down;
    this.queue    = [];
    this.handlers = [];

    window.addEventListener('message', ({ source, data }) => {
      if (source != window) return;

      if (data.type == 'ETH_RPC' && (data.channel == this.down)) {
        if (this.queue.length > 0) {
          const found = this.queue.findIndex(i => (i.method == data.method && i.id == data.id));

          if (found != -1) {
            // calls callback(error, result)
            this.queue[found].callback.call(this, null, data);
            this.queue.splice(found, 1);
          }
        }

        if (this.handlers.length > 0)
          this.handlers.forEach(h => h.call(this, data));
      }
    }, false);
  }

  handle (callback) {
    this.handlers.push(callback)
    return this;
  }

  send (payload, callback) {
    if (callback)
      this.queue.push({ method: payload.method, id: payload.id, callback });

    window.postMessage({ type: 'ETH_RPC', channel: this.up, ...payload }, '*');
    return this;
  }
}

// calls background.js directly
// passing JSON RPC to eth node
export const ethRpc = {
  send (payload) {
    return delegateTo.background({ type: 'ETH_RPC', ...payload })
  },

  getTxPricing (tx) {
    return Promise.all([
      this.send(raw.balance(tx.params.from)),
      this.send(raw.gasPrice),
      this.send(raw.gasEstimate(tx.params))
    ]);
  },

  getLatestNonce () {
    return account.address().then(([a]) => this.send(raw.nonce(a)));
  }
}

// format raw JSON
// RPC messages
export const raw = {
  format: (method, params, id='1') => {
    return JSON.parse(JSON.stringify({
      id,
      method,
      jsonrpc: '2.0',
      params
    }));
  },

  balance (address) {
    return this.format('eth_getBalance', [address, 'latest']);
  },

  get gasPrice () {
    return this.format('eth_gasPrice');
  },

  gasEstimate (params) {
    return this.format('eth_estimateGas', [params]);
  },

  nonce (address) {
    return this.format('eth_getTransactionCount', [address, 'latest']);
  },

  tx (tx) {
    return this.format('eth_sendRawTransaction', [tx]);
  }
}
