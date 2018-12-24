import { transaction }    from 'lib/storage'
import { raw }            from 'lib/rpc'
import { sign as signer } from 'ethjs-signer'

export function auth (tx) {
  return new Promise(resolve => {

    chrome.runtime.onMessage.addListener(message => {
      if ( message.type == 'TX_SIGNED')
        resolve(raw.format('eth_sendRawTransaction', [message.tx], message.id));
    });

    transaction.add(tx);
    chrome.browserAction.setPopup({popup: "popup.html"});
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
