import * as wallet from 'ethereumjs-wallet'
import Encryptor   from './workers/encryptor.worker.js'
import Decryptor   from './workers/decryptor.worker.js'
import { toHex }   from 'lib/helpers'

export function initialize () {
  save({
    deviceAddress: null,
    deviceNonce: '0x0',
    deviceNonceTimeStamp: 0
  });
}

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

const collection = function (name) {
  return {
    get () {
      return load(name).then(items => items || []);
    },

    shift () {
      return this.get().then(items => {
        save({ [name]: items.slice(1) });
        return items[0];
      })
    },

    add (item) {
      return this.get().then(items => {
        save({ [name]: [...(items || []), item] });
      })
    },

    size() {
      return this.get().then(items => {
        return items.length;
      })
    }
  }
}

export const connection = {
  pending: collection('pendingCnxs'),
  authorized: collection('authorizedCnxs'),
  rejected: collection('rejectedCnxs')
}

export const transaction = collection('pendingTxs');

export const account = {
  address () {
    return load('deviceAddress').then(a => a ? [a] : []);
  },

  nonce: {
    current () { return load('deviceNonce'); },

    up (number=1) {
      return this.current().then(current => {
        const deviceNonce = toHex(parseInt(current) + number);
        return save({ deviceNonce, deviceNonceTimeStamp: Date.now() });
      })
    },

    async track (remote) {
      const local  = await this.current();
      const timeStamp = await load('deviceNonceTimeStamp');

      if (parseInt(remote) > parseInt(local) || Date.now() - timeStamp > 300000) {
        save({ deviceNonce: remote, deviceNonceTimeStamp: Date.now() });
        return remote;
      }
      else return local;
    }
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
        w.onerror = (e) => {
          e.preventDefault();
          reject();
          w.terminate();
        }
      });
    });
  }
}
