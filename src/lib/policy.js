import { account, connection } from 'lib/storage'

export async function connect (request) {
  const { authorized, requests } = connection;
  const authList = await authorized.get();
  const address  = await account.address();

  return new Promise((resolve, reject) => {
    if (authList.indexOf(request) != -1) {
      resolve(address);
    }
    else {
      chrome.runtime.onMessage.addListener(function handleConnect(message) {
        if ( message.type == 'CONNECT_DAPP' && message.origin == request.origin) {

          chrome.runtime.onMessage.removeListener(handleConnect);
          authorized.add(requests.shift());
          resolve(address);

        } else if ( message.type == 'REJECT_DAPP' && message.origin == request.origin) {

          chrome.runtime.onMessage.removeListener(handleConnect);
          reject(new Error('Account connection rejected'));
        }
      });
      requests.add(request);
    }
  })
}
