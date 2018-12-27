import { transaction }    from 'lib/storage'
import { raw }            from 'lib/rpc'
import { sign as signer } from 'ethjs-signer'

export function auth (tx) {
  return new Promise(() => {
    transaction.add(tx)
      .then(() => transaction.size())
      .then(size => {
        chrome.browserAction.setPopup({popup: 'popup.html'});
        chrome.browserAction.setBadgeText({text: size.toString()});
      });
  });
}

export function sign (rawTx, sk) {
  return Promise.resolve(signer(rawTx, sk));
}

export function noncify (tx, nonce) {
  return transaction.nonce.track(nonce).then(updated => {
    return Object.assign(tx, { nonce: updated });
  });
}
