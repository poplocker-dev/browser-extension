import * as wallet from 'ethereumjs-wallet'
import Encryptor   from './workers/encryptor.worker.js'
import Decryptor   from './workers/decryptor.worker.js'
import { toHex }   from 'lib/helpers'

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

export const transaction = {
  pending () {
    return load('pending');
  },

  nonce: {
    current () { return load('nonce'); },

    up (number=1) {
      return this.current().then(current => {
        const nonce = toHex(parseInt(current) + number);
        return save({ nonce });
      })
    },

    async track (remote) {
      const local  = await this.current();

      if (parseInt(remote) > parseInt(local)) {
        save({ nonce: remote });
        return remote;
      }
      else return local;
    }
  },

  shift () {
    return this.pending().then(txs => {
      save({ pending: txs.slice(1) });
      return txs[0];
    })
  },

  add (tx) {
    return this.pending().then(txs => {
      tx.txId = Math.random().toString(36).substr(2, 5);
      save({ pending: [...(txs || []), tx] });
    })
  },

  size() {
    return this.pending().then(txs => {
      return txs.length;
    })
  }
}

export const account = {
  address () {
    return load('deviceAddress').then(a => a ? [a] : []);
  },

  generate (secret) {
    const keys = wallet.generate();
    const sk = keys.getPrivateKeyString();
    const deviceAddress = keys.getChecksumAddressString();
    return this.encrypt(sk, secret)
               .then(data => {return {deviceAddress, ...data}})
  },

  encrypt (sk, secret) {
    return new Promise((resolve, reject) => {
      const w = new Encryptor();

      w.postMessage({ sk, secret });
      w.onmessage = ({ data }) => {
        resolve(data);
        w.terminate();
      }
      w.onerror = () => {
        reject();
        w.terminate();
      }
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
        w.onerror = () => {
          reject();
          w.terminate();
        }
      });
    });
  }
}
