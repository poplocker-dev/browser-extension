// this sends messages to
// background.js
export const background = {
  send: (msg) => {
    let message = { ...msg, port: 'background' };

    return new Promise((resolve, reject) => {
      try{
        chrome.runtime.sendMessage(message, response => {
          if (chrome.runtime.lastError || !response)
            reject(chrome.runtime.lastError || "No response defined");
          else if (response.error)
            reject(response.error);
          else
            resolve(response);
        });
      } catch(error) {
        reject(error.message)
      }
    });
  }
}

// calls background.js through
// proxy. Used by injected.js
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
