import { background } from 'lib/rpc'
import { account }    from 'lib/storage'

export function getTxPricing (tx) {
  return Promise.all([
    send(raw.balance(tx.params.from)),
    send(raw.gasPrice),
    send(raw.gasEstimate(tx.params))
  ]);
}

export function getLatestNonce () {
  return account.address.current().then(([a]) => send(raw.nonce(a)));
}

export function rawSendTx (tx) {
  return raw.tx(tx);
}

// dispatches to Ethereum node
function send (payload) {
  return background.send({ type: 'ETH_RPC', ...payload })
}

// format raw JSON
// RPC messages
const raw = {
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

  gasEstimate (params) {
    return this.format('eth_estimateGas', [params]);
  },

  nonce (address) {
    return this.format('eth_getTransactionCount', [address, 'latest']);
  },

  tx (tx) {
    return this.format('eth_sendRawTransaction', [tx]);
  }
}
