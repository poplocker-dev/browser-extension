import { sign, noncify } from 'lib/tx'
import { dispatch }      from 'lib/dispatcher'
import { badge }         from 'lib/helpers'
import { initialize,
         save,
         account,
         connection,
         transaction }   from 'lib/storage'

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason == 'install') initialize();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.port == 'background') {

    message.origin = sender.url;

    switch (message.type) {

      case 'ETH_RPC':
        dispatch(message).then(sendResponse)
                         .catch(sendResponse);
        break;

      case 'NEW_ACCOUNT':
        account.generate(message.secret)
               .then(save)
               .then(sendResponse)
               .catch(sendResponse)
        break;

      case 'CHANGE_PASSWORD':
        account.decrypt(message.oldSecret)
               .then(sk => account.encrypt(sk, message.newSecret))
               .then(save)
               .then(sendResponse)
               .catch(sendResponse)
        break;

      case 'TX_SIGN':
        noncify(message.tx, message.blockNonce).then(tx => {
          account.decrypt(message.secret)
                 .then(sk => sign(tx, sk))
                 .then(sendResponse)
                 .catch(sendResponse)});
        break;

      case 'CNX_AUTHORIZED':
      case 'CNX_REJECTED':
      case 'TX_SIGNED':
      case 'TX_CANCEL':
        sendResponse(true);
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

save({
  pendingCnxs: [],
  rejectedCnxs: [],
  pendingTxs: []
});
