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
  });
}

export function sign (rawTx, sk) {
  return Promise.resolve(signer(rawTx, sk));
}
