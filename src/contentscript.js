import { background, RpcProxy } from 'lib/rpc'

dirtyInjectProvider();

const proxy = new RpcProxy('ETH_RX', 'ETH_TX');
proxy.handle(handleBackground);

function dirtyInjectProvider () {
  const el = document.createElement('script');
  const container = document.head || document.documentElement;

  el.src = chrome.extension.getURL('injected.js');

  el.onload = function() {
    this.remove();
  };

  container.insertBefore(el, container.children[0]);
}

function handleBackground (payload) {
  return background.send(payload)
    .then(response => proxy.send(response))
}
