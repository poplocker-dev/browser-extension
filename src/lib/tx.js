import { save, load } from 'lib/storage'
import { sign as signer } from 'ethjs-signer'

export function auth (tx) {
  return new Promise(resolve => {

    chrome.runtime.onMessage.addListener(message => {
      if ( message.type == 'TX_SIGNED')
        resolve(formatSignedTx(message));
    });

    load('pending').then(txs => {
      save({ pending: [...(txs || []), tx] });
    });
  });
}

export function sign (rawTx, sk) {
  return Promise.resolve(signer(rawTx, sk));
}

function formatSignedTx (message) {
  return {
    params: [message.tx],
    method: 'eth_sendRawTransaction',
    jsonrpc: '2.0',
    id: 222
  }
}
