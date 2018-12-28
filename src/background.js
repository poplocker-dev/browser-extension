// TODO: better namespacing
import { sign, noncify }              from 'lib/tx'
import { dispatch, raw }              from 'lib/rpc'
import { account, save, transaction } from 'lib/storage'

chrome.runtime.onInstalled.addListener(() => {
  save({
    address: null,
    pending: [],
    nonce: "0x0"
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.port == 'background') {
    switch (message.type) {

      case 'ACCOUNT_GEN':
        account.generate(message.secret)
               .then(save)
               .then(sendResponse);
        break;

      case 'ETH_RPC':
        dispatch(message).then(sendResponse);
        break;

      case 'TX_INFO':
        Promise.all([

          dispatch(raw.balance(message.params.from)),
          dispatch(raw.gasPrice),
          dispatch(raw.gasEstimate(message.params))

        ]).then(sendResponse);
        break;

      case 'TX_SIGN':
        account.address()
               .then(([address]) =>
                     dispatch(raw.nonce(address)))
               .then(({ result }) =>
                     noncify(message.transaction, result))
               .then(tx => {
                 account.decrypt(message.secret)
                        .then(sk => sign(tx, sk))
                        .then(sendResponse);
               });
        break;

      case 'TX_SIGNED':
        transaction.nonce.up()
                   .then(transaction.shift)
                   .then(sendResponse);
        break;
    }
    return true;
  }
});
