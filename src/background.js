import { sign, signMetaTx, noncify }              from 'lib/tx'
import { ethDispatch, apiDispatch }               from 'lib/dispatcher'
import { badge }                                  from 'lib/helpers'
import { initialise, save, account, transaction } from 'lib/storage'
import smartLocker                                from 'lib/smartlocker'

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason == 'install') initialise();
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

        // TODO: dispatcher for transactions
      case 'TX_SIGN':
        // TODO: remove deviceAddress() when gas relayers
        account.address.all().then(([deviceAddress, smartLockerAddress]) => {
          if (smartLockerAddress) {
            // TODO: ultimately the tx will be sent to gas relayers, however for now send through web3
            // TODO: remove this device noncify() when gas relayers
            noncify(message.tx, message.blockNonce).then(tx => {
              smartLocker.getNextNonce(smartLockerAddress).then((smartLockerNonce) => {
                Promise.all([account.decrypt(message.secret), account.nonce.track(smartLockerNonce, true)])
                       .then(([sk, smartLockerNonce]) => signMetaTx(tx, sk, deviceAddress, smartLockerAddress, smartLockerNonce))
                       .then(sendResponse)
                       .catch(sendResponse)
              });
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

  if (changes.deviceAddress)
    changes.deviceAddress.newValue ? badge.reset() : badge.warning();
});
