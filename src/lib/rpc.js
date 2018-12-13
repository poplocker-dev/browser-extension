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
      return auth(message).then(sendToNode);

    default:
      return sendToNode(message);
  }
}

export function decorate ({ method, id, jsonrpc }, result) {
  return Promise.resolve({ result, method, id, jsonrpc });
}

function sendToNode (message) {
  // parity strict nodes don't like extra props
  const { id, method, jsonrpc, params } = message;
  return eth.sendAsync({ id, method, jsonrpc, params });
}
