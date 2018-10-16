import { generateAccount, encrypt, save } from 'lib/keyring'

chrome.runtime.onMessage.addListener(({ message, secret }, sender, sendResponse) => {
  switch (message) {
    case 'KEY_GEN':
      generateAccount()
        .then(keys => encrypt(keys, secret))
        .then(save)
        .then(({ address }) => sendResponse({ address }))
        .catch(sendResponse);
  }
  return true;
});
