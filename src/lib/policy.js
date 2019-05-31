import { account, connection } from 'lib/storage'

const promiseQ = function () {
  let queue = [];

  return {
    addOnce (request) {
      const promise = new Promise((resolve, reject) => {
        if (!queue.find(i => i.request == request)) {
          queue.push({ request, resolve, reject });
        }
      });
      // NOTE: should we maintain singleton promise?
      return promise;
    },

    reject (error) {
      return queue.shift().reject(error);
    },

    resolve (address) {
      return queue.shift().resolve(address);
    }
  }
}();

chrome.runtime.onMessage.addListener(function handleRequest(message) {
  if (message.type == 'CONNECT_DAPP') {
    connection.authorized
              .add(message.request)
              .then(account.address)
              .then(promiseQ.resolve);
    connection.requests.shift();
    chrome.runtime.onMessage.removeListener(handleRequest);
  }
  else if (message.type == 'REJECT_DAPP') {
    connection.requests.shift();
    promiseQ.reject(new Error('User rejected connection request'));
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

  if (rqsList.indexOf(request) == -1) {
    connection.requests.add(request);
  }

  return promiseQ.addOnce(request);
}
