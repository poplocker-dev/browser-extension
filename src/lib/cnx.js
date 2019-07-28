import { connection } from 'lib/storage'
import { getDomain }  from 'lib/helpers'

export async function authorizeCnx (origin) {
  const request = getDomain(origin) || origin;
  const authorizedCnxs = await connection.authorized.get();
  const rejectedCnxs = await connection.rejected.get();
  const pendingCnxs = await connection.pending.get();

  return new Promise((resolve, reject) => {
    if (authorizedCnxs.indexOf(request) != -1 || !request.indexOf('chrome-extension://' + chrome.runtime.id)) {
      resolve();
    } else if (rejectedCnxs.indexOf(request) != -1) {
      reject(new Error('Unauthorized connection request: ' + request));
    } else {

      chrome.runtime.onMessage.addListener(function handleCnxRequest(message) {
        if (message.request == request && (message.type == 'CNX_AUTHORIZED' || message.type == 'CNX_REJECTED')) {
          if (message.type == 'CNX_AUTHORIZED') {
            connection.authorized.add(request)
            resolve();
          } else if (message.type == 'CNX_REJECTED') {
            connection.rejected.add(request);
            reject(new Error('User rejected connection request: ' + request));
          }
          connection.pending.shift();
          chrome.runtime.onMessage.removeListener(handleCnxRequest);
        }
      });

      if (pendingCnxs.indexOf(request) == -1) {
        connection.pending.add(request);
      }
    }
  });
}
