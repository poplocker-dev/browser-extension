import { account }           from 'lib/storage'
import { auth }              from 'lib/tx'
import { connect, withAuth } from 'lib/policy'
import smartLocker           from 'lib/smartlocker'
import ShhRpc                from 'lib/rpc/whisper'
import keyRequests           from 'lib/key_requests'
import HttpProvider          from 'ethjs-provider-http'
import EthRpc                from 'ethjs-rpc'

const eth = new EthRpc(new HttpProvider(process.env.RPC_URL));
const shh = new ShhRpc(process.env.SHH_URL, process.env.GAS_RELAY_TOPIC);

export function ethDispatch(message) {
  const result = () => {
    switch (message.method) {

      case 'eth_requestAccounts':
        return connect(message.origin);

      case 'eth_accounts':
        return withAuth(message.origin, () => {
          return account.address.current();
        }, () => []);

      case 'eth_sendTransaction':
        return auth(message).then(sendToNodeOrWhisper);

      default:
        return sendToNode(message);
    }
  };
  return result().then(r => decorate(message, r))
                 .catch(e => decorateError(message, e));
}

//TODO: better error handling
export function apiDispatch(message) {
  const result = () => {
    switch (message.method) {
      case 'setSmartLockerAddress':
        return account.address
                      .setLocker(message.address)
                      .then(keyRequests.subscribe(message.address))
                      .catch(() => `Failed: ${message.method}`);

      case 'getSmartLockerState':
        return account.address.all().then(results => {
          return smartLocker.getState(...results);
        }).catch(() => `Failed: ${message.method}`);

      case 'removeKeyRequest':
        return Promise.resolve(keyRequests.remove(message.address))
                      .catch(() => `Failed: ${message.method}`);

      default:
        return Promise.reject(`No such method: ${message.method}`);
    }
  };

  return withAuth(message.origin, result, () => 'Account not connected')
    .then(r => decorate(message, r))
    .catch(e => decorateError(message, e));
}

function decorate({ method, id, jsonrpc }, result) {
  return { ...{ method, id, jsonrpc, result } };
}

function decorateError ({method, id, jsonrpc }, error) {
  return {...{method, id, jsonrpc, error: error.message }};
}

async function sendToNodeOrWhisper(message) {
  const addr = await account.address.locker();
  if (addr) {
    const response = await sendToWhisper(message);
    return upSmartLockerNonce().then(() => response);
  } else {
    const response = await sendToNode(message);
    return upDeviceNonce().then(() => response);
  }
}

function strip({ id, method, jsonrpc, params }) {
  // parity strict nodes don't like extra props
  return { id, method, jsonrpc, params };
}

function upDeviceNonce() {
  return account.nonce.up();
}

function upSmartLockerNonce() {
  return account.nonce.up(1, true);
}

function sendToNode(message) {
  return eth.sendAsync(strip(message));
}

function sendToWhisper(message) {
  return shh.post(message.params[0]);
}
