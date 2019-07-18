import * as wallet from 'ethereumjs-wallet'
import Encryptor from './workers/encryptor.worker.js'
import Decryptor from './workers/decryptor.worker.js'
import { toHex } from 'lib/helpers'

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

    add (item, adder) {
      return this.get().then(items => {
        if (adder) save({ [name]: [...(items || []), adder.call(item)] })
        else {
          save({ [name]: [...(items || []), item] })
        }
      })
    },

    size() {
      return this.get().then(items => {
        return items.length;
      })
    }
  }
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

export const connection = {
  requests: collection('requests'),
  authorized: collection('authorized')
}

export function initialize () {
  save({
    deviceAddress: null,
    smartLockerAddress: null,
    pending: [],
    deviceNonce: '0x0',
    deviceNonceTimeStamp: 0,
    smartLockerNonce: '0x0',
    smartLockerNonceTimeStamp: 0,
  })
}

//TODO: use collection here
export const transaction = {
  pending () {
    return load('pending');
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
  address: {
    device () {
      return load('deviceAddress');
    },

    locker( ) {
      return load('smartLockerAddress');
    },

    current () {
      return this.all().then(([deviceAddress, smartLockerAddress]) => {
        if (deviceAddress) {
          return smartLockerAddress ? [smartLockerAddress] : [deviceAddress]
        } else {
          return []
        }
      })
    },

    all () {
      return Promise.all([this.device(), this.locker()]);
    },

    setLocker (addr) {
      return save({
        smartLockerAddress: addr,
        smartLockerNonce: '0x0',
        smartLockerNonceTimeStamp: 0,
      });
    }
  },

  nonce: {
    current(smartLocker = false) {
      return smartLocker ? load('smartLockerNonce') : load('deviceNonce')
    },

    up(number = 1, smartLocker = false) {
      return this.current(smartLocker).then(current => {
        const nonce = toHex(parseInt(current) + number)
        return smartLocker
          ? save({
            smartLockerNonce: nonce,
            smartLockerNonceTimeStamp: Date.now(),
          })
          : save({ deviceNonce: nonce, deviceNonceTimeStamp: Date.now() })
      })
    },

    async track(remote, smartLocker = false) {
      const local = await this.current(smartLocker)
      const timeStamp = smartLocker
            ? await load('smartLockerNonceTimeStamp')
            : await load('deviceNonceTimeStamp')

      if (
        parseInt(remote) > parseInt(local) ||
          Date.now() - timeStamp > 300000
      ) {
        smartLocker
          ? save({
            smartLockerNonce: remote,
            smartLockerNonceTimeStamp: Date.now(),
          })
          : save({ deviceNonce: remote, deviceNonceTimeStamp: Date.now() })
        return remote
      } else return local
    },
  },

  generate(secret) {
    const keys = wallet.generate()
    const sk = keys.getPrivateKeyString()
    const deviceAddress = keys.getChecksumAddressString()
    return this.encrypt(sk, secret).then(data => {
      return { deviceAddress, ...data }
    })
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
