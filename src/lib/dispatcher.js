import { account }       from 'lib/storage'
import { auth }          from 'lib/tx'
import { connect }       from 'lib/policy'
import * as HttpProvider from 'ethjs-provider-http'
import * as EthRPC       from 'ethjs-rpc'

const eth = new EthRPC(new HttpProvider(process.env.RPC_URL));

export function dispatch (message) {
  const result = () => {
    switch (message.method) {

      case 'eth_requestAccounts':
      case 'eth_accounts':
        return connect(message.origin);

      case 'eth_sendTransaction':
        return auth(message).then(sendToNode).then(upNonce);

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

function upNonce (response) {
  return account.nonce.up().then(() => response);
}

function sendToNode (message) {
  return eth.sendAsync(strip(message));
}
