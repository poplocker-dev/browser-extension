import { account, connection } from 'lib/storage'

export function connect (request) {
  return new Promise((resolve, reject) => {
    chrome.runtime.onMessage.addListener(function handleConnect(message) {
      if ( message.type == 'CONNECT_DAPP' && message.origin == request.origin) {

        chrome.runtime.onMessage.removeListener(handleConnect);
        connection.authorized.add(connection.requests.shift());
        resolve(account.address());

      } else if ( message.type == 'REJECT_DAPP' && message.origin == request.origin) {

        chrome.runtime.onMessage.removeListener(handleConnect);
        reject(new Error('Account connection rejected'));
      }
    });
    connection.requests.add(request.origin);
  })
}
