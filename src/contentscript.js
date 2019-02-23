import { delegateTo, MessagingProxy } from 'lib/rpc'

dirtyInjectProvider();

const rpcProxy = new MessagingProxy('ETH_RPC', 'ETH_RX', 'ETH_TX');
rpcProxy.handle((payload) => {
  return delegateTo.background(payload)
    .then(response => rpcProxy.send(response))
  }
);

const popLockerProxy = new MessagingProxy('POPLOCKER_API', 'POPLOCKER_RX', 'POPLOCKER_TX');
popLockerProxy.handle((payload) => {
  return delegateTo.background(payload)
    .then(response => popLockerProxy.send(response))
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
