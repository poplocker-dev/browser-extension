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

export const raw = {
  format: (method, params, id='1') => {
    return JSON.parse(JSON.stringify({
      id,
      method,
      jsonrpc: '2.0',
      params
    }));
  },

  balance (address) {
    return this.format('eth_getBalance', [address, 'latest']);
  },

  get gasPrice () {
    return this.format('eth_gasPrice');
  },

  nonce (address) {
    return this.format('eth_getTransactionCount', [address, 'latest']);
  }
}

function decorate ({ method, id, jsonrpc, params, result }, mergedResult) {
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

