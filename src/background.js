import { sign, noncify }              from 'lib/tx'
import { dispatch, raw }              from 'lib/rpc'
import { account, save, transaction } from 'lib/storage'

initialise();

function initialise() {
  account.address()
         .then(([address]) => {
           if(address) {
             transaction.size()
                        .then(size => {
                          if (size > 0) {
                            chrome.browserAction.setPopup({popup: 'popup.html'});
                            chrome.browserAction.setBadgeText({text: size.toString()});
                          } else {
                            chrome.browserAction.setPopup({popup: ''});
                            chrome.browserAction.setBadgeText({text: ''});
                          }
                        });
           } else {
             chrome.browserAction.setBadgeText({text: '!'});
           }
         });
}

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.update({url: 'http://poplocker-dev.github.io'});
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.port == 'background') {
    switch (message.type) {

      case 'ACCOUNT_GEN':
        account.generate(message.secret)
               .then(save)
               .then((response) => {
                 chrome.browserAction.setPopup({popup: ''});
                 chrome.browserAction.setBadgeText({text: ''});
                 return response;
               })
               .then(sendResponse);
        break;

      case 'ETH_RPC':
        dispatch(Object.assign({ url: sender.url }, message)).then(sendResponse);
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
                   .then(() => transaction.size())
                   .then(size => {
                     if (size > 0) {
                       chrome.browserAction.setBadgeText({text: size.toString()});
                     } else {
                       chrome.browserAction.setPopup({popup: ''});
                       chrome.browserAction.setBadgeText({text: ''});
                    }
                   })
                   .then(sendResponse);
        break;
    }
    return true;
  }
});
