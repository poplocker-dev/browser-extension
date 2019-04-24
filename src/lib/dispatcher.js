import { account }  from 'lib/storage'
import { auth }     from 'lib/tx'
import smartLocker  from 'lib/smartlocker'
import ShhRpc       from 'lib/rpc/whisper'
import HttpProvider from 'ethjs-provider-http'
import EthRpc       from 'ethjs-rpc'

console.log('creation');
const eth = new EthRpc(new HttpProvider(process.env.RPC_URL));
const shh = new ShhRpc(process.env.SHH_URL, process.env.SYM_KEY);

export function ethDispatch (message) {
  const result = () => {
    switch (message.method) {

        // non-private by default for now
      case 'eth_requestAccounts':
      case 'eth_accounts':
        return account.address.current();

      case 'eth_sendTransaction':
        return tapToNodeOrWhisper().then(f => {
          return auth(message).then(f).then(upNonce);
        });

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
        return account.address
                      .setLocker(message.address)
                      .catch(() => {return `Failed: ${message.method}`});

      case 'getSmartLockerState':
        return account.address.all().then(results => {
          return smartLocker.getState(...results);
        }).catch(() => { return `Failed: ${message.method}` });

      default:
        return Promise.reject(`No such method: ${message.method}`);
    }
  }
  return result().then(r => decorate(message, r));
}

function decorate ({ method, id, jsonrpc }, result) {
  return {...{ method, id, jsonrpc, result }};
}

async function tapToNodeOrWhisper () {
  const addr = await account.address.locker();
  if (addr) {
    return Promise.resolve(sendToWhisper);
  } else {
    return Promise.resolve(sendToNode);
  }
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
  return shh.post(message.params[0]);
}
