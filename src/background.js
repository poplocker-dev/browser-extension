import { sign, signMetaTx, noncify } from 'lib/tx'
import { ethDispatch, apiDispatch }  from 'lib/dispatcher'
import { badge }                     from 'lib/helpers'
import { initialize,
         save,
         account,
         connection,
         transaction }               from 'lib/storage'
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
        ethDispatch(message).then(sendResponse)
                            .catch(sendResponse);
        break;

      case 'POPLOCKER_API':
        apiDispatch(message).then(sendResponse)
                            .catch(sendResponse);
        break;

      case 'NEW_ACCOUNT':
        account.generate(message.secret)
               .then(save)
               .then(sendResponse)
               .catch(sendResponse);
        break;

      case 'CHANGE_PASSWORD':
        account.decrypt(message.oldSecret)
               .then(sk => account.encrypt(sk, message.newSecret))
               .then(save)
               .then(sendResponse)
               .catch(sendResponse)
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

      case 'CNX_AUTHORIZED':
      case 'CNX_REJECTED':
      case 'TX_SIGNED':
      case 'TX_CANCEL':
        sendResponse(true);
        break;

      case 'SMARTLOCKER_NAME':
        smartLocker.getName(message.address)
          .then(sendResponse)
          .catch(sendResponse)
        break;
    }
    return true;
  }
});

chrome.storage.onChanged.addListener(changes => {
  if (changes.deviceAddress || changes.pendingCnxs || changes.pendingTxs) {
    account.address().then(([address]) => {
      if (!address) badge.warning();
      else {
        connection.pending.size().then(pendingCnxSize => {
          if (pendingCnxSize > 0) badge.cnxs = pendingCnxSize;
          else {
            transaction.size().then(pendingTxSize => {
              if (pendingTxSize > 0) badge.txs = pendingTxSize;
              else badge.reset();
            });
          }
        });
      }
    });
  }
});

account.address.locker().then(address => keyRequests.subscribe(address));

connection.pending.clear();
connection.rejected.clear();
transaction.clear();
