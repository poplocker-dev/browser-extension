import { account, save } from 'lib/storage'
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
        return auth(message).then(sendToNode);

      default:
        return sendToNode(message);
    }
  }
  return result().then(r => decorate(message, r));
}

export function apiDispatch (message) {
  const result = () => {
    switch (message.method) {

      case 'generateDeviceAddress':
        return account.generate(message.secret).then(save);

      case 'getDeviceAddress':
        return account.address.device();

      case 'getSmartLockerAddress':
        return account.address.locker();

      case 'setSmartLockerAddress':
        return account.address.setLocker(message.address);

      case 'getSmartLockerState':
        return account.address.all()
                      .then(results => smartLocker.getState(...results));

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

function sendToNode (message) {
  return eth.sendAsync(strip(message));
}

