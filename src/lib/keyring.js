import * as wallet from 'ethereumjs-wallet'

export function generateAccount () {
  try       { return Promise.resolve(wallet.generate()); }
  catch (e) { return Promise.reject(); }
}

export function encrypt (keys, secret) {
  try {
    return Promise.resolve({
      address: keys.getChecksumAddressString(),
      v3: keys.toV3(secret)
    });
  }
  catch (e) { return Promise.reject(); }
}

export function save (payload) {
  return new Promise((resolve, reject) => {

    chrome.storage.local.set(payload, () => {
      if (!chrome.runtime.lastError) resolve(payload);
      else reject();
    });

  })
}
