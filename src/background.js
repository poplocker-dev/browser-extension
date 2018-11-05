import { generateAccount, save, load } from 'lib/keyring'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {

    case 'ACCOUNT_GEN':
      generateAccount(message.secret)
        .then(save)
        .then(sendResponse);
      break;

    case 'ETH_RPC':
      dispatchRpc(message).then(sendResponse);
      break;
  }
  return true;
});

function dispatchRpc (message) {
  switch (message.method) {

    case 'eth_accounts':
      return load('address')
        .then(result => decorate(message, result));

    default:
      //TODO: use async RPC bridge for infura test node
      return decorate(message, 'NOP');
  }
}

function decorate ({ method, id, jsonrpc }, result) {
  return Promise.resolve({ result, method, id, jsonrpc });
}
