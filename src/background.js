import { generateAccount, save } from 'lib/keyring'

chrome.runtime.onMessage.addListener(({ message, secret }, sender, sendResponse) => {
  switch (message) {
    case 'ACCOUNT_GEN':
      generateAccount(secret).then(save).then(sendResponse);
      return true;
  }
});
