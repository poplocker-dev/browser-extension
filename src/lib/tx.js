import { save, load }     from 'lib/storage'
import { format }         from 'lib/rpc'
import { sign as signer } from 'ethjs-signer'

export function auth (tx) {
  return new Promise(resolve => {

    chrome.runtime.onMessage.addListener(message => {
      if ( message.type == 'TX_SIGNED')
        resolve(format.raw('eth_sendRawTransaction', [message.tx]));
    });

    load('pending').then(txs => {
      save({ pending: [...(txs || []), tx] });
    });
  });
}

export function sign (rawTx, sk) {
  return Promise.resolve(signer(rawTx, sk));
}
