import { sign, noncify }              from 'lib/tx'
import { dispatch, raw }              from 'lib/rpc'
import { account, save, transaction } from 'lib/storage'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.port == 'background') {
    switch (message.type) {

      case 'ACCOUNT_GEN':
        account.generate(message.secret)
               .then(save)
               .then(sendResponse);
        //TODO: within promise
        chrome.browserAction.setPopup({popup: ""});
        break;

      case 'ETH_RPC':
        dispatch(message).then(sendResponse);
        break;

      case 'TX_INFO':
        transaction.pending().then(([pending]) => {
          const params = pending.params[0];
          account.address().then(([address]) => {
            Promise.all([

              dispatch(raw.balance(address)),
              dispatch(raw.gasPrice),
              dispatch(raw.gasEstimate(params))

            ]).then(sendResponse);
          });
        });
        break;

      case 'TX_SIGN':
        account.address()
               .then(([address]) => dispatch(raw.nonce(address)))
               .then(({ result }) => noncify(message.transaction, result))
               .then(tx => {
                 account.decrypt(message.secret)
                        .then(sk => sign(tx, sk))
                        .then(sendResponse);

               });
        break;

      case 'TX_SIGNED':
        transaction.nonce.up()
                   .then(transaction.shift())
                   .then(sendResponse);
        //TODO: within promise
        transaction.pending()
          .then(({ result }) => {
            if(result == null) {
              chrome.browserAction.setPopup({popup: ""});
            }
        });
        break;
    }
    return true;
  }
});

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.update({url: "http://poplocker-dev.github.io"});
});
