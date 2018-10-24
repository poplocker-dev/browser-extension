import Worker from './workers/encryptor.worker.js';

export function generateAccount (secret) {
  return new Promise((resolve, reject) => {
    try {
      const w = new Worker();

      w.postMessage({ secret });
      w.onmessage = ({ data }) => {
        resolve(data);
        w.terminate();
      }
    }
    catch (e) { console.error(e); reject(); }
  });
}

export function save (payload) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set(payload, () => {
        resolve(payload);
      });
    }
    catch (e) { console.error(e); reject(); }
  })
}
