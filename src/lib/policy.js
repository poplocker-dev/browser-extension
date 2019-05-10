import { account, connection } from 'lib/storage'
import { rawSendTx }           from 'lib/rpc/eth_node'
import { sign as signer }      from 'ethjs-signer'

export function connect (request) {
  return new Promise((resolve, reject) => {
    chrome.runtime.onMessage.addListener(function handleConnect(message) {
      if ( message.type == 'CONNECT_DAPP' && message.origin == request.origin) {

        chrome.runtime.onMessage.removeListener(handleConnect);
        resolve(this.address());

      } else if ( message.type == 'REJECT_DAPP' && message.origin == request.origin) {

        chrome.runtime.onMessage.removeListener(handleConnect);
        reject(new Error('Account connection rejected'));
      }
    });
    connection.add(message);
  })
}
