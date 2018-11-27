export const notify = {
  send: (msg, port) => {
    let message = Object.assign(msg, { port });

    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        let e = chrome.runtime.lastError;
        if (e) {
          console.error('Sending message failed', message, port, e);
          reject(e);
        }
        else resolve(response);
      });
    });
  },

  background: function(message) {
    return this.send(message, 'background');
  },

  popup: function(message) {
    return this.send(message, 'popup');
  }
}

export class Proxy {
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

    window.postMessage(Object.assign({ type: 'ETH_RPC', channel: this.up }, payload), '*');
    return this;
  }
}
