import Worker from './workers/encryptor.worker.js';

export function save (payload) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set(payload, () => {
        resolve(payload);
      });
    }
    catch (e) { console.error(e); reject(e); }
  })
}

export function load (id) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get([id], (value) => {
        if (Object.keys(value).indexOf(id) != -1)
          resolve(value[id]);
        else
          resolve(null);
      });
    }
    catch (e) { console.error(e); reject(e) }
  })
}

export const account = {
  get address () {
    return load('address').then(a => [a] || []);
  },
  
  generate (secret) {
    return new Promise((resolve, reject) => {
      try {
        const w = new Worker();

        w.postMessage({ secret });
        w.onmessage = ({ data }) => {
          resolve(data);
          w.terminate();
        }
      }
      catch (e) { console.error(e); reject(e); }
    });
  }
}
