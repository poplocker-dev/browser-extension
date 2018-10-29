import { generateAccount, save } from 'lib/keyring'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'ACCOUNT_GEN':
      generateAccount(message.secret).then(save).then(sendResponse);
      break;
    case 'ETH_RPC':
      //TODO: use async RPC bridge for infura test node
      return sendResponse({ body: 'NOP', method: message.method });
  }
  return true;
});
