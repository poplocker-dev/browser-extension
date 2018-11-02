import { generateAccount, save, load } from 'lib/keyring'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'ACCOUNT_GEN':
      generateAccount(message.secret)
        .then(save)
        .then(sendResponse);
      break;
    case 'ETH_RPC':
      dispatchRpc(message)
        .then(response => decorate(message.method, response))
        .then(sendResponse);
      break;
  }
  return true;
});

function dispatchRpc (message) {
  switch (message.method) {
    case 'eth_accounts':
      return load('address')
    default:
      //TODO: use async RPC bridge for infura test node
      return Promise.resolve({ body: 'NOP' })
  }
}

function decorate (method, response) {
  return Promise.resolve({ response, method });
}
