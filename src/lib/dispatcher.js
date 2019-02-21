import { account }       from 'lib/storage'
import { auth }          from 'lib/tx'
import * as HttpProvider from 'ethjs-provider-http'
import * as EthRPC       from 'ethjs-rpc'

const eth = new EthRPC(new HttpProvider(process.env.RPC_URL));

export function dispatch (message) {
  const result = () => {
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
  return result().then(r => decorate(message, r));
}

function decorate ({ method, id, jsonrpc }, result) {
  return {...{ method, id, jsonrpc, result }};
}

function strip({ id, method, jsonrpc, params }) {
  // parity strict nodes don't like extra props
  return { id, method, jsonrpc, params };
}

function sendToNode (message) {
  return eth.sendAsync(strip(message));
}

