import { account, connection } from 'lib/storage'

const promiseQ = function () {
  let queue = [];

  return {
    addOnce (request) {
      const promise = new Promise((resolve, reject) => {
        if (!queue.find(i => i.request == request)) {
          queue.add({ request, resolve, reject });
        }
      });
      return promise;
    },

    reject (msg) {
      return queue.shift().reject(msg);
    },

    resolve (address) {
      return queue.shift().resolve(address);
    }
  }
}

async function authorizeRequest (request) {
  const address = await account.address();
  connection.authorized.add(request).then(() => {
    return address;
  });
}

chrome.runtime.onMessage.addListener(function handleRequest(message) {
  if (message.type == 'CONNECT_DAPP') {
    authorizeRequest(message.request).then(promiseQ.resolve);
    chrome.runtime.onMessage.removeListener(handleRequest);
  }
  else if (message.type == 'REJECT_DAPP') {
    promiseQ.reject('User rejected connection request');
    chrome.runtime.onMessage.removeListener(handleRequest);
  }
});

export async function connect (request) {
  const authList = await connection.authorized.get();
  const rqsList  = await connection.requests.get();

  if (authList.indexOf(request) != -1) {
    const address = await account.address();
    return Promise.resolve(address);
  }

  if (rqsList.indexOf(request) != -1) {
    const address = await account.address();
    return Promise.resolve(address);
  }

  return promiseQ.addOnce(request);
}
