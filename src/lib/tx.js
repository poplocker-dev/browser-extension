import { transaction, account } from 'lib/storage'
import { rawSendTx }            from 'lib/rpc/eth_node'
import smartLocker              from 'lib/smartlocker'
import { sign as signer }       from 'ethjs-signer'

export async function auth (tx) {
  const pending = await transaction.pending();

  return new Promise(resolve => {
    chrome.runtime.onMessage.addListener(function handleSign(message) {
      if ( message.type == 'TX_SIGNED' && message.txId == tx.txId) {

        resolve(rawSendTx(message.tx));
        chrome.runtime.onMessage.removeListener(handleSign);

      } else if ( message.type == 'TX_CANCEL' && message.txId == tx.txId) {
        chrome.runtime.onMessage.removeListener(handleSign);
      }
    });
    if (pending.map(p => p.id).indexOf(tx.id) == -1)
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
