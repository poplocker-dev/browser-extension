import { sign, noncify }              from 'lib/tx'
import { dispatch }                   from 'lib/dispatcher'
import { badge }                      from 'lib/helpers'
import { account, save, transaction } from 'lib/storage'

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason == 'install')
    save({
      address: null,
      pending: [],
      nonce: "0x0"
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.port == 'background') {

    message.origin = sender.url;

    switch (message.type) {

      case 'ACCOUNT_GEN':
        account.generate(message.secret)
               .then(save)
               .then(sendResponse);
        break;

      case 'ETH_RPC':
        dispatch(message).then(sendResponse)
                         .catch(sendResponse);
        break;

      case 'TX_SIGN': {
        noncify(message.tx, message.blockNonce).then(tx => {
          account.decrypt(message.secret)
                 .then(sk => sign(tx, sk))
                 .then(sendResponse)
                 .catch(sendResponse)});
        break;
      }

      // tx.js/auth listens to it too
      case 'TX_SIGNED':
        transaction.nonce.up()
                   .then(() => transaction.shift())
                   .then(sendResponse);
        break;

      case 'TX_CANCEL':
        transaction.shift()
                   .then(sendResponse);
        break;

      case 'POPLOCKER_API':
        return new Promise((resolve, reject) => {

          switch (message.method) {

            case 'getSmartLockerState':
              resolve({
                method: message.method,
                id: message.id,
                result: 'TODO - Simple, Pending or the Name of retrieved smart locker'
              });
              break;

            case 'setSmartLockerAddress':
              resolve({
                method: message.method,
                id: message.id,
                result: 'TODO - address set to ' + message.address
              });
              break;

          }
        }).then(sendResponse);
        break;
    }
    return true;
  }
});

transaction.pending().then(p => {
  if (p && p.length > 0)
    badge.info = p.length;
});

chrome.storage.onChanged.addListener(changes => {
  if (changes.pending && changes.pending.newValue)
    badge.info = changes.pending.newValue.length || '';

  if (changes.address)
    changes.address.newValue ? badge.reset() : badge.warning();
});

