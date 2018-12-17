import { account, save }              from 'lib/storage'
import { sign, fetchPricing }         from 'lib/tx'
import { dispatch, decorate, raw } from 'lib/rpc'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.port == 'background') {
    switch (message.type) {

      case 'ACCOUNT_GEN':
        account.generate(message.secret)
               .then(save)
               .then(sendResponse);
        break;

      case 'ACCOUNT_BALANCE':
        account.address()
               .then(a => dispatch(raw.balance(a[0])))
               .then(sendResponse)
        break;

      case 'ETH_RPC':
        dispatch(message)
          .then(r => decorate(message, r))
          .then(sendResponse);
        break;

      case 'TX_SIGN':
        account.decrypt(message.secret)
               .then(sk => sign(message.transaction, sk))
               .then(sendResponse);
        break;

      case 'TX_ENRICH':
        Promise.all([
          fetchPricing()
        ]).then(sendResponse);
        break;
    }
    return true;
  }
});
