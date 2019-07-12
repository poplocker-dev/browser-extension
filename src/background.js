import { sign, signMetaTx, noncify } from 'lib/tx'
import { ethDispatch, apiDispatch }  from 'lib/dispatcher'
import { badge }                     from 'lib/helpers'
import { account, save, initialize,
         transaction,
         connection }                from 'lib/storage'
import smartLocker                   from 'lib/smartlocker'
import keyRequests                   from 'lib/key_requests'

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason == 'install') initialize();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.port == 'background') {

    message.origin = sender.url;

    switch (message.type) {

      case 'ETH_RPC':
        ethDispatch(message).then(sendResponse);
        break;

      case 'POPLOCKER_API':
        apiDispatch(message).then(sendResponse);
        break;

      case 'NEW_ACCOUNT':
        account.generate(message.secret)
               .then(save)
               .then(sendResponse)
        break;

      case 'CHANGE_PASSWORD':
        account.decrypt(message.oldSecret)
               .then(sk => account.encrypt(sk, message.newSecret))
               .then(save)
               .then(sendResponse)
        break;

      case 'TX_SIGN':
        account.address.locker().then((smartLockerAddress) => {
          if (smartLockerAddress) {
            smartLocker.getNextNonce(smartLockerAddress).then((smartLockerNonce) => {
              Promise.all([account.decrypt(message.secret), account.nonce.track(smartLockerNonce, true)])
                     .then(([sk, smartLockerNonce]) => signMetaTx(message.tx, sk, smartLockerAddress, smartLockerNonce))
                     .then(sendResponse)
                     .catch(sendResponse)
            });
          } else {
            noncify(message.tx, message.blockNonce).then(tx => {
              account.decrypt(message.secret)
                     .then(sk => sign(tx, sk))
                     .then(sendResponse)
                     .catch(sendResponse)
            });
          }
        })
        break;

      case 'TX_SIGNED':
      case 'TX_CANCEL':
        transaction.shift()
                   .then(sendResponse);
        break;

      //TODO: move that to POPLOCKER_API
      case 'SMARTLOCKER_NAME':
        smartLocker.getName(message.address)
                   .then(sendResponse)
        break;
    }
    return true;
  }
});

account.address.locker().then(address => keyRequests.subscribe(address));

transaction.pending().then(p => {
  if (p && p.length > 0)
    badge.info = p.length;
});

connection.requests.get().then(r => {
  if (r && r.length > 0)
    badge.rqs = r.length;
});

chrome.storage.onChanged.addListener(changes => {
  if (changes.requests && changes.requests.newValue)
    badge.rqs = changes.requests.newValue.length || '';

  if (changes.pending && changes.pending.newValue)
    badge.info = changes.pending.newValue.length || '';

  if (changes.deviceAddress)
    changes.deviceAddress.newValue ? badge.reset() : badge.warning();
});

