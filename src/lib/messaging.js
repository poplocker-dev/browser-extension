export function sendToBackground (message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {

      if (chrome.runtime.lastError) {
        console.error('Sending message failed', message);
        reject();
      }

      if (response)
        resolve(response);
      else
        reject();
    });
  })
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
          const found = this.queue.findIndex(i => i.method == data.method);

          if (found != -1) {
            this.queue[found].callback.call(this, data.response);
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
      this.queue.push({ method: payload.method, callback });

    window.postMessage(Object.assign({ type: 'ETH_RPC', channel: this.up, method: payload.method }, payload), '*');
    return this;
  }
}
