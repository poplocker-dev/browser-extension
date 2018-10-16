import { generateKeypair } from 'lib/keyring'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'KEY_GEN':
      generateKeypair().then(account => sendResponse({ address: account.address }));
  }
  return true;
})
