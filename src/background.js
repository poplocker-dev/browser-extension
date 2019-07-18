import { sign, noncify } from 'lib/tx'
import { dispatch }      from 'lib/dispatcher'
import { badge }         from 'lib/helpers'
import { account,
         save,
	 initialize,
         transaction,
         connection } from 'lib/storage'

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason == 'install') initialize();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.port == 'background') {

    message.origin = sender.url;

    switch (message.type) {

    case 'ETH_RPC':
      dispatch(message).then(sendResponse);
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
