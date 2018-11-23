import { load } from 'lib/keyring'
import * as HttpProvider from 'ethjs-provider-http'
import * as EthRPC from 'ethjs-rpc'

const eth = new EthRPC(new HttpProvider(process.env.RPC_URL));

// parity strict nodes don't like extra props
function strip (message) {
  const { id, method, jsonrpc, params } = message;
  return { id, method, jsonrpc, params }
}

function dispatcher (message) {
  switch (message.method) {

    // non-private by default for now
    case 'eth_requestAccounts':
    case 'eth_accounts':
      return load('address');

    case 'eth_subscribe':
    case 'eth_sendTransaction':
    case 'eth_getTransactionReceipt':
      console.error('NOOP')
      return Promise.reject('NOOP');

    default:
      return eth.sendAsync(strip(message));
  }
}

export function decorate ({ method, id, jsonrpc }, result) {
  return Promise.resolve({ result, method, id, jsonrpc });
}

export function dispatchRpc (message) {
  return dispatcher(message).catch(console.error);
}
