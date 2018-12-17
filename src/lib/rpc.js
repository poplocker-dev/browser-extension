import { account }       from 'lib/storage'
import { auth }          from 'lib/tx'
import * as HttpProvider from 'ethjs-provider-http'
import * as EthRPC       from 'ethjs-rpc'

const eth = new EthRPC(new HttpProvider(process.env.RPC_URL));

export function dispatch (message) {
  switch (message.method) {

      // non-private by default for now
    case 'eth_requestAccounts':
    case 'eth_accounts':
      return account.address();

    case 'eth_sendTransaction':
      return auth(message).then(decorate).then(sendToNode);

    default:
      return sendToNode(message);
  }
}

export function decorate ({ method, id, jsonrpc, params, result }, mergedResult) {
  const props = { 
    method, 
    id,
    jsonrpc,
    result: (result || mergedResult),
    params
  }
  return Object.assign({}, props);
}

function sendToNode (message) {
  // parity strict nodes don't like extra props
  const { id, method, jsonrpc, params } = message;
  return eth.sendAsync({ id, method, jsonrpc, params });
}

export const raw = {
  format: (method, params) => {
    return {
      method,
      jsonrpc: '2.0',
      params,
      id: '1'
    }
  },
 
  balance (address) {
    return this.format('eth_getBalance', [address, 'latest']);
  }
}
