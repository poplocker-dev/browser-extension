import { account, transaction } from 'lib/storage'
import { rawSendTx }            from 'lib/rpc/eth_node'
import { sign as signer }       from 'ethjs-signer'

export function auth (tx) {
  return new Promise(resolve => {
    chrome.runtime.onMessage.addListener(function handleSign(message) {
      if ( message.type == 'TX_SIGNED' && message.txId == tx.txId) {

        resolve(rawSendTx(message.tx));
        chrome.runtime.onMessage.removeListener(handleSign);

      } else if ( message.type == 'TX_CANCEL' && message.txId == tx.txId) {
        chrome.runtime.onMessage.removeListener(handleSign);
      }
    });
    transaction.add(tx);
  });
}

export function sign (rawTx, sk) {
  return Promise.resolve(signer(rawTx, sk));
}

export function noncify (tx, nonce) {
  return account.nonce.track(nonce).then(updated => {
    return {...tx, nonce: updated};
  });
}
