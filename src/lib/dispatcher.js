import { account }       from 'lib/storage'
import { auth }          from 'lib/tx'
import smartLocker       from 'lib/smartlocker'
import * as HttpProvider from 'ethjs-provider-http'
import * as EthRPC       from 'ethjs-rpc'

const eth = new EthRPC(new HttpProvider(process.env.RPC_URL));

export function ethDispatch (message) {
  const result = () => {
    switch (message.method) {

        // non-private by default for now
      case 'eth_requestAccounts':
      case 'eth_accounts':
        return account.address.current();

      case 'eth_sendTransaction':
        return account.address.locker().then((smartLockerAddress) => {
          if (smartLockerAddress) {
            return sendToWhisper;
          } else {
            return sendToNode;
          }
        }).then((f) => auth(message).then(f).then(upNonce));

      default:
        return sendToNode(message);
    }
  }
  return result().then(r => decorate(message, r));
}

export function apiDispatch (message) {
  const result = () => {
    switch (message.method) {

      case 'setSmartLockerAddress':
        return account.address.setLocker(message.address)
          .catch(() => {return `Failed: ${message.method}`});

      case 'getSmartLockerState':
        return account.address.all().then(results => {
          return smartLocker.getState(...results);
        })
        .catch(() => {return `Failed: ${message.method}`});

      default:
        return Promise.reject(`No such method: ${message.method}`);
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
  return account.nonce.up().then(account.nonce.up(1, true)).then(() => response);
}

function sendToNode (message) {
  return eth.sendAsync(strip(message));
}

function sendToWhisper (message) {
  // TODO
  alert(JSON.stringify(message, null, 4));
}
