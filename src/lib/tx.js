import { transaction }    from 'lib/storage'
import { raw }            from 'lib/rpc'
import { smartLocker }    from 'lib/smartlocker'
import { sign as signer } from 'ethjs-signer'

export function auth (tx) {
  return new Promise(resolve => {
    chrome.runtime.onMessage.addListener(function handleSign(message) {
      if ( message.type == 'TX_SIGNED' && message.txId == tx.txId) {
        resolve(raw.tx(message.tx));
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

// TODO: remove deviceAddress() when gas relayers
export function signMetaTx (rawTx, sk, deviceAddress, smartLockerAddress, smartLockerNonce) {
  const metaTx = smartLocker.createMetaTx(rawTx, sk, smartLockerAddress, smartLockerNonce);
  // TODO: when gas relayers, metaTx will be broadcast to them 
  //return Promise.resolve(metaTx);

  // TODO: until gas relayers, send web3 transaction from local device (hence sign again)
  const data = smartLocker.encodeExecuteSigned(metaTx);
  // TODO: gas relayers should recalcualte gas limit here - for now, just use high value
  const gasLimit = '0x' + (250000).toString(16);
  rawTx = {...rawTx, from: deviceAddress, to: smartLockerAddress, value: '0x0', data: data, gasLimit: gasLimit};
  return Promise.resolve(signer(rawTx, sk));
}

export function noncify (tx, nonce) {
  return transaction.nonce.track(nonce).then(updated => {
    return {...tx, nonce: updated};
  });
}
