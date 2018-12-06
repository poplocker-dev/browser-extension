import Encryptor from './workers/encryptor.worker.js';
import Decryptor from './workers/decryptor.worker.js';

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
  address () {
    return load('address').then(a => [a] || []);
  },
  
  generate (secret) {
    return new Promise((resolve, reject) => {
      const w = new Encryptor();

      w.postMessage({ secret });
      w.onmessage = ({ data }) => {
        resolve(data);
        w.terminate();
      }
      w.onerror = () => reject();
    });
  },
  
  decrypt (secret) {
    return new Promise((resolve, reject) => {
      Promise.all([load('encrypted'), load('salt')]).then(([encrypted, salt]) => {
        
        const w = new Decryptor();

        w.postMessage({ encrypted, salt, secret });
        w.onmessage = ({ data }) => {
          resolve(data);
          w.terminate();
        }
        w.onerror = () => reject();
      });
    });
  }
}
