import { generateAccount, save } from 'lib/keyring'
import { dispatchRpc, decorate } from 'lib/rpc'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {

    case 'ACCOUNT_GEN':
      generateAccount(message.secret)
        .then(save)
        .then(sendResponse);
      break;

    case 'ETH_RPC':
      dispatchRpc(message)
        .then(r => decorate(message, r))
        .then(sendResponse)
      break;
  }
  return true;
});

