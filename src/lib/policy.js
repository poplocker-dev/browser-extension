import { account, connection } from 'lib/storage'

export async function connect (origin) {
  const { authorized, requests } = connection;

  const request  = new URL(origin).hostname;
  const authList = await authorized.get();
  const rqsList  = await requests.get();
  const address  = await account.address();

  if (authList.indexOf(request) != -1)
    return Promise.resolve(address);

  //TODO: this doesn't work after reload
  // figure out how to remove pending request on reload
  // for each install listener?
  if (rqsList.indexOf(request) != -1)
    return Promise.resolve(undefined);

  requests.add(request).then(() => {
    return new Promise((resolve, reject) => {
      chrome.runtime.onMessage.addListener(function handleConnect(message) {
        if (message.type == 'CONNECT_DAPP' && message.request == request) {
          requests.shift().then(rq => {
            authorized.add(rq).then(() => {
              chrome.runtime.onMessage.removeListener(handleConnect);
              resolve(address);
            });
          });
        }

        else if (message.type == 'REJECT_DAPP' && message.request == request) {
          requests.shift();
          chrome.runtime.onMessage.removeListener(handleConnect);
          reject(new Error('Account connection rejected'));
        }
      });
    });
  });
}
