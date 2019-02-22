import { delegateTo, RpcProxy, PopLockerApiProxy } from 'lib/rpc'

dirtyInjectProvider();

const rpcProxy = new RpcProxy('ETH_RX', 'ETH_TX');
rpcProxy.handle((payload) => {
  return delegateTo.background(payload)
    .then(response => rpcProxy.send(response))
  }
);

const popLockerApiProxy = new PopLockerApiProxy('POPLOCKER_RX', 'POPLOCKER_TX');
popLockerApiProxy.handle((payload) => {
  return delegateTo.background(payload)
    .then(response => popLockerApiProxy.send(response))
  }
);

function dirtyInjectProvider () {
  const el = document.createElement('script');
  const container = document.head || document.documentElement;

  el.src = chrome.extension.getURL('injected.js');

  el.onload = function() {
    this.remove();
  };

  container.insertBefore(el, container.children[0]);
}
