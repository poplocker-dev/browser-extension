import { account }      from 'lib/storage'
import { authorizeCnx } from 'lib/cnx'
import { authorizeTx }  from 'lib/tx'
import HttpProvider     from 'ethjs-provider-http'
import EthRPC           from 'ethjs-rpc'

const eth = new EthRPC(new HttpProvider(process.env.RPC_URL));

export function dispatch (message) {
  const result = () => {
    switch (message.method) {

      case 'eth_requestAccounts':
      case 'eth_accounts':
        return authorizeCnx(message.origin).then(account.address);

      case 'eth_sendTransaction':
        return authorizeTx(message).then(sendToNode).then(upNonce);

      default:
        return sendToNode(message);
    }
  }
  return result().then(r => decorate(message, r))
                 .catch(e => decorateError(message, e));
}

function decorate ({ method, id, jsonrpc }, result) {
  return {...{ method, id, jsonrpc, result }};
}

function decorateError ({method, id, jsonrpc }, error) {
  return {...{method, id, jsonrpc, error: error.message }};
}

function strip ({ id, method, jsonrpc, params }) {
  // parity strict nodes don't like extra props
  return { id, method, jsonrpc, params };
}

function upNonce (response) {
  return account.nonce.up().then(() => response);
}

function sendToNode (message) {
  return eth.sendAsync(strip(message));
}
