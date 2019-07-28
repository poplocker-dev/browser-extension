import { account, transaction } from 'lib/storage'
import { rawSendTx }            from 'lib/rpc/eth_node'
import { sign as signer }       from 'ethjs-signer'

let txId = 0;

export function authorizeTx (tx) {
  return new Promise((resolve, reject) => {

    chrome.runtime.onMessage.addListener(function handleTxSign(message) {
      if (message.txId == tx.txId && (message.type == 'TX_SIGNED' || message.type == 'TX_CANCEL')) {
        if (message.type == 'TX_SIGNED') {
          resolve(rawSendTx(message.tx));
        } else if (message.type == 'TX_CANCEL') {
          reject(new Error('User rejected transaction: ' + tx.txId));
        }
        transaction.shift();
        chrome.runtime.onMessage.removeListener(handleTxSign);
      }
    });

    tx.txId = txId++;
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
