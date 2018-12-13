import { account, save } from 'lib/storage'
import { sign } from 'lib/tx'
import { dispatch, decorate } from 'lib/rpc'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.port == 'background') {
    switch (message.type) {

      case 'ACCOUNT_GEN':
        account.generate(message.secret)
          .then(save)
          .then(sendResponse);
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

      case 'TX_FETCH_PRICING':
        fetch(process.env.GAS_API_URL)
          .then(r => r.json())
          .then(r => sendResponse(r.average));
        break;
    }
    return true;
  }
});
