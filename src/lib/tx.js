import { transaction, account } from 'lib/storage'
import { rawSendTx }            from 'lib/rpc/eth_node'
import smartLocker              from 'lib/smartlocker'
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

export function signMetaTx (rawTx, sk, smartLockerAddress, smartLockerNonce) {
  return Promise.resolve(smartLocker.createMetaTx(rawTx, sk, smartLockerAddress, smartLockerNonce));
}

export function noncify (tx, nonce, smartLocker=false) {
  return account.nonce.track(nonce, smartLocker).then(updated => {
    return {...tx, nonce: updated};
  });
}
