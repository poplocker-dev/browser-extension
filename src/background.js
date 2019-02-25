import { sign, noncify }              from 'lib/tx'
import { dispatch }                   from 'lib/dispatcher'
import { badge }                      from 'lib/helpers'
import { account, save, transaction } from 'lib/storage'

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason == 'install')
    save({
      deviceAddress: null,
      smartLockerAddress: null,
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
        switch (message.method) {

          case 'getSmartLockerState':
            Promise.all([account.deviceAddress(), account.smartLockerAddress()])
                    // TODO: return Simple or Pending or name of SmartLocker - depending on deviceAddress and smartLockerAddress
                   .then(([deviceAddress, smartLockerAddress]) => popLockerApiResponse(message, deviceAddress + '/' + smartLockerAddress))
                   .then(sendResponse)
                   .catch(() => popLockerApiResponse(message, null))
                   .then(sendResponse);
          break;

          case 'setSmartLockerAddress':
            save( { smartLockerAddress: message.address } )
              .then(() => popLockerApiResponse(message, true))
              .then(sendResponse)
              .catch(() => popLockerApiResponse(message, false))
              .then(sendResponse);
          break;

        }
        break;

    }
    return true;
  }
});

// TODO: move this to helpers and rename to better name?
function popLockerApiResponse({ method, id }, result) {
  return new Promise((resolve, reject) => {
    resolve( {...{ method, id, result } } );
  })
}

transaction.pending().then(p => {
  if (p && p.length > 0)
    badge.info = p.length;
});

chrome.storage.onChanged.addListener(changes => {
  if (changes.pending && changes.pending.newValue)
    badge.info = changes.pending.newValue.length || '';

  if (changes.deviceAddress)
    changes.deviceAddress.newValue ? badge.reset() : badge.warning();
});
